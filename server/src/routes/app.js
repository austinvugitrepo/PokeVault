const express = require("express");
const session = require("express-session");
const { rateLimit } = require("express-rate-limit");
const { scryptSync, timingSafeEqual } = require("node:crypto");

const healthRoutes = require("./health");
const requireAuth = require("../middleware/requireAuth");

// Database table routers (moved from the old src/server.js).
const dataRouters = {
  Generation: require("./data/Generation"),
  Pokemon_Ability_Map: require("./data/Pokemon_Ability_Map"),
  Pokemon_Ability: require("./data/Pokemon_Ability"),
  Pokemon_Type_Map: require("./data/Pokemon_Type_Map"),
  PokemonID: require("./data/PokemonID"),
  PokemonLvl: require("./data/PokemonLvl"),
  PokemonType: require("./data/PokemonType"),
  TeamConfiguration: require("./data/TeamConfiguration"),
  TeamMember: require("./data/TeamMember"),
  User: require("./data/User"),
};

const {
  SESSION_SECRET,
  DEMO_USERNAME,
  DEMO_PASSWORD,
} = process.env;

if (
  !SESSION_SECRET ||
  SESSION_SECRET.length < 32 ||
  !DEMO_USERNAME ||
  !DEMO_PASSWORD
) {
  throw new Error(
    "Set SESSION_SECRET (at least 32 characters), " +
    "DEMO_USERNAME, and DEMO_PASSWORD before starting."
  );
}

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use(
  session({
    name: "pokevault.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // Local HTTP development only.
      maxAge: 60 * 60 * 1000,
    },
  })
);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Try again later.",
  },
});

// One environment-configured account for local development.
const passwordSalt = "pokevault-local-demo";
const expectedPassword = scryptSync(
  DEMO_PASSWORD,
  passwordSalt,
  64
);

app.get("/", (req, res) => {
  res.json({ message: "PokeVault API" });
});

app.use("/api/health", healthRoutes);

app.post("/api/auth/login", loginLimiter, (req, res, next) => {
  const { username, password } = req.body || {};

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.length > 200 ||
    password.length > 1000
  ) {
    return res.status(400).json({
      error: "A valid username and password are required.",
    });
  }

  const providedPassword = scryptSync(password, passwordSalt, 64);
  const passwordMatches = timingSafeEqual(
    providedPassword,
    expectedPassword
  );

  if (username !== DEMO_USERNAME || !passwordMatches) {
    return res.status(401).json({
      error: "Invalid username or password.",
    });
  }

  // Replace any previous session after successful authentication.
  req.session.regenerate(error => {
    if (error) return next(error);

    req.session.userId = DEMO_USERNAME;

    req.session.save(error => {
      if (error) return next(error);

      res.json({
        user: { id: req.session.userId },
      });
    });
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({
    user: { id: req.session.userId },
  });
});

app.get("/api/dashboard", requireAuth, (req, res) => {
  res.json({
    message: "You have authenticated dashboard access.",
    user: { id: req.session.userId },
  });
});

app.post("/api/auth/logout", requireAuth, (req, res, next) => {
  req.session.destroy(error => {
    if (error) return next(error);

    res.clearCookie("pokevault.sid", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      path: "/",
    });

    res.json({ message: "Signed out." });
  });
});

// Same URLs the old src/server.js used, e.g. /api/Generation.
for (const [name, router] of Object.entries(dataRouters)) {
  app.use(`/api/${name}`, router);
}

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
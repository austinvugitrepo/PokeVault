const express = require("express");
const session = require("express-session");
const { rateLimit } = require("express-rate-limit");
const { randomBytes, scryptSync, timingSafeEqual } = require("node:crypto");

const healthRoutes = require("./health");
const requireAuth = require("../middleware/requireAuth");
const pool = require("../db");

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

function startSession(req, res, next, id) {
  // Replace any previous session after successful authentication.
  req.session.regenerate(error => {
    if (error) return next(error);

    req.session.userId = id;

    req.session.save(error => {
      if (error) return next(error);

      res.json({
        user: { id: req.session.userId },
      });
    });
  });
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyStoredPassword(password, passwordHash) {
  if (typeof passwordHash !== "string") return false;

  const separator = passwordHash.indexOf(":");
  if (separator <= 0 || separator === passwordHash.length - 1) {
    return false;
  }

  const salt = passwordHash.slice(0, separator);
  const storedHex = passwordHash.slice(separator + 1);

  let stored;
  let computed;
  try {
    stored = Buffer.from(storedHex, "hex");
    computed = Buffer.from(
      scryptSync(password, salt, 64).toString("hex"),
      "hex"
    );
  } catch {
    return false;
  }

  if (stored.length === 0 || stored.length !== computed.length) {
    return false;
  }

  return timingSafeEqual(computed, stored);
}

app.get("/", (req, res) => {
  res.json({ message: "PokeVault API" });
});

app.use("/api/health", healthRoutes);

app.post("/api/auth/login", loginLimiter, async (req, res, next) => {
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

  // Check the User table first, then fall back to the demo account.
  try {
    const result = await pool.query(
      'SELECT userid, username, passwordhash FROM "User" ' +
        "WHERE LOWER(username) = LOWER($1) LIMIT 1",
      [username]
    );
    const row = result.rows[0];

    if (row) {
      if (verifyStoredPassword(password, row.passwordhash)) {
        return startSession(req, res, next, row.username);
      }

      return res.status(401).json({
        error: "Invalid username or password.",
      });
    }
  } catch (error) {
    // Database is down or unreachable; keep the demo login working.
    console.error(error);
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

  startSession(req, res, next, DEMO_USERNAME);
});

// Creates an account in Norland's User table. The frontend logs in after this.
app.post("/api/auth/register", loginLimiter, async (req, res) => {
  const { username: rawUsername, password } = req.body || {};

  if (
    typeof rawUsername !== "string" ||
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 1000
  ) {
    return res.status(400).json({
      error: "A valid username and password are required.",
    });
  }

  const username = rawUsername.trim();

  if (!username || username.length > 255) {
    return res.status(400).json({
      error: "A valid username and password are required.",
    });
  }

  if (username.toLowerCase() === DEMO_USERNAME.toLowerCase()) {
    return res.status(409).json({ error: "That username is taken." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    await client.query('LOCK TABLE "User" IN EXCLUSIVE MODE');

    const existing = await client.query(
      'SELECT 1 FROM "User" WHERE LOWER(username) = LOWER($1) LIMIT 1',
      [username]
    );

    if (existing.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "That username is taken." });
    }

    const idResult = await client.query(
      'SELECT COALESCE(MAX(userid), 0) + 1 AS next_id FROM "User"'
    );
    const userId = idResult.rows[0].next_id;
    const email = `${username}@pokevault.local`;
    const passwordHash = hashPassword(password);

    await client.query(
      'INSERT INTO "User" (userid, username, email, passwordhash, createdat) ' +
        "VALUES ($1, $2, $3, $4, CURRENT_DATE)",
      [userId, username, email, passwordHash]
    );
    await client.query("COMMIT");

    res.status(201).json({ user: { id: username } });
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Ignore rollback errors and still return a generic failure.
      }
    }
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  } finally {
    if (client) client.release();
  }
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
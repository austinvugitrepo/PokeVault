const express = require("express")
const healthRoutes = require("./routes/health");


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "PokeVault API",
  });
});

app.use("/api/health", healthRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

module.exports = app;
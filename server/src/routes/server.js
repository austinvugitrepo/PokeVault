// Loads environment variables from .env
require('dotenv').config()

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PokeVault API running at http://localhost:${PORT}`);
});
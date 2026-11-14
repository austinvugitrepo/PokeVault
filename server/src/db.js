const { Pool } = require("pg");

// PostgreSQL connection pool.
// Defaults match database/docker-compose.yml. The password has no default
// on purpose: set POKEVAULT_DB_PASSWORD (or PGPASSWORD) in your environment.
const pool = new Pool({
  user: process.env.PGUSER || "pokevault",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "pokevault",
  password: process.env.POKEVAULT_DB_PASSWORD || process.env.PGPASSWORD,
  port: Number(process.env.PGPORT || 5432),
});

module.exports = pool;

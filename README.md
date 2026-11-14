# PokeVault

PokeVault is a React single-page app built with react-router-dom that pulls Pokémon data from the public [PokeAPI](https://pokeapi.co/), backed by an Express API and PostgreSQL.

## Project layout

- `src/`: React frontend
- `server/`: Express backend (auth, health, and the `/api/*` table routes)
- `database/`: PostgreSQL 16 via Docker Compose (see `database/README.md`)

## Getting started

### Frontend

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

### Backend

```bash
cd server
npm install
```

The server reads its settings from environment variables. `server/.env.example` lists every one. Copy it to `server/.env`, fill in real values, and load it into your shell before starting:

```bash
cp .env.example .env    # then edit .env
set -a; . ./.env; set +a
npm start               # or: npm run dev (auto-restarts with nodemon)
```

The API runs at [http://localhost:5000](http://localhost:5000). Check it with `curl http://localhost:5000/api/health`.

Required variables:

- `SESSION_SECRET`: at least 32 random characters
- `DEMO_USERNAME`, `DEMO_PASSWORD`: the local demo login
- `POKEVAULT_DB_PASSWORD`: must match the password used for the database

Never commit `.env` or any real passwords.

### Database

Start PostgreSQL from `database/` with the same `POKEVAULT_DB_PASSWORD` set:

```bash
cd database
docker compose up
```

No tables exist yet, so the `/api/*` table routes return a 500 error until the schema is added.

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

The server reads its settings from environment variables. `server/.env.example` lists every one. Copy it to `server/.env` and fill in real values. The server loads it on startup:

```bash
cp .env.example .env    # then edit .env
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

### Testing Database Tables

Startup the Frontend (Can be done in either powershell inside the PokeVault directory, or through Visual Studio Code)

```bash
npm start
```

Edit the test .env file with the following to reach the database

 Copy to server/.env and fill in real values. Never commit .env.
PORT=5000
SESSION_SECRET= 32_random_characters
DEMO_USERNAME= ex_user
DEMO_PASSWORD= ex_password
 Database (defaults match database/docker-compose.yml)
PGHOST=localhost
PGPORT=5442
PGUSER=postgres
PGDATABASE=PokeVault
POKEVAULT_DB_PASSWORD= 

Startup the Backend (Usually done in Powershell in the server directory)

```bash
cd server
npm start
```
### Postman

Open up the Postman application and test the endpoints with SQL Queries with the following link format:

http://localhost:5000/api/endpoint

Endpoints should match the name of the /routes/data js files without the js extension

Example:

Do a GET Request (You should see 1 test entry in the result box)

http://localhost:5000/api/Generation

### Testing the Team Builder

The Team Builder page searches the Gen 1 Pokémon in the `PokemonID` table and lets you build a team of up to 6.

1. Create and fill the two tables it needs, in this order (`PokemonID` depends on `Generation`). Run them in pgAdmin's Query Tool, or with `psql` from the repo root:

```bash
psql -h localhost -p 5442 -U postgres -d PokeVault -f Generation_Table_Creation_Script.sql
psql -h localhost -p 5442 -U postgres -d PokeVault -f Generation_Table_Population_Script.sql
psql -h localhost -p 5442 -U postgres -d PokeVault -f PokemonID_Table_Creation_Script.sql
psql -h localhost -p 5442 -U postgres -d PokeVault -f PokemonID_Table_Population_Script_Gen1.sql
```

2. Start the backend (`cd server`, then `npm start`) and the frontend (`npm start` in the repo root).
3. Open [http://localhost:3000/team-builder](http://localhost:3000/team-builder), or click Team Builder in the navbar or on the homepage.
4. Check that all 151 Pokémon load, searching by name filters the list, Add puts a Pokémon on your team (no duplicates), Remove takes it off, and Add stops working at 6/6.

The app also works without the database, but the Team Builder will show an error since it can't load any Pokémon.

Saving teams is not built yet.

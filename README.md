# PokeVault

PokeVault is a React single-page app built with react-router-dom that pulls Pokémon data from the public [PokeAPI](https://pokeapi.co/), backed by an Express API and PostgreSQL.

## Project layout

- `src/`: React frontend
- `server/`: Express backend (auth, health, and the `/api/*` table routes)
- `database/`: PostgreSQL 16 via Docker Compose (see `database/README.md`)
- `*.sql` (repo root): table creation and population scripts

## Getting started

Run every command from the repo root unless a step says otherwise. Commands work in both bash and PowerShell except where a PowerShell version is shown.

### 1. Set up the server's `.env`

```bash
cd server
npm install
cp .env.example .env    # PowerShell: Copy-Item .env.example .env
cd ..
```

Edit `server/.env` and fill in:

- `SESSION_SECRET`: at least 32 random characters
- `DEMO_USERNAME`, `DEMO_PASSWORD`: the local demo login
- `POKEVAULT_DB_PASSWORD`: any password; the database in step 2 is created with it

The other values already match the Docker database. The server loads this file on startup, and Docker reads the password from it too. Never commit `.env` or any real passwords.

### 2. Start the database

```bash
docker compose -f database/docker-compose.yml --env-file server/.env up -d
```

This starts PostgreSQL in the background on `localhost:5432` with an empty `pokevault` database. Stop it with the same command, using `down` instead of `up -d`.

### 3. Create and fill the tables

The Team Builder needs the `Generation` and `PokemonID` tables, loaded in this order because `PokemonID` depends on `Generation`.

bash:

```bash
for f in Generation_Table_Creation_Script.sql Generation_Table_Population_Script.sql PokemonID_Table_Creation_Script.sql PokemonID_Table_Population_Script_Gen1.sql; do
  docker compose -f database/docker-compose.yml --env-file server/.env exec -T postgres psql -U pokevault -d pokevault < "$f"
done
```

PowerShell:

```powershell
$OutputEncoding = [System.Text.UTF8Encoding]::new()
foreach ($f in 'Generation_Table_Creation_Script.sql','Generation_Table_Population_Script.sql','PokemonID_Table_Creation_Script.sql','PokemonID_Table_Population_Script_Gen1.sql') {
  Get-Content -Raw -Encoding UTF8 $f | docker compose -f database/docker-compose.yml --env-file server/.env exec -T postgres psql -U pokevault -d pokevault
}
```

You'll see `ERROR: role "postgres" does not exist` once per creation script. That's harmless: the scripts set the table owner to `postgres`, which the Docker database doesn't have, and the tables are still created. Run this step once; running it again gives "already exists" and duplicate key errors.

Using your own PostgreSQL install instead (for example with pgAdmin)? Point the `PG*` values in `server/.env` at it and run the same scripts in its Query Tool.

### 4. Start the backend and frontend

In one terminal:

```bash
cd server
npm start               # or: npm run dev (auto-restarts with nodemon)
```

In another, from the repo root:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). The API runs at [http://localhost:5000](http://localhost:5000); check it with `curl http://localhost:5000/api/health`.

The app also works without the database, but the Team Builder will show an error since it can't load any Pokémon.

## Testing

### Team Builder

1. Open [http://localhost:3000/team-builder](http://localhost:3000/team-builder), or click Team Builder in the navbar or on the homepage.
2. Check that all 151 Pokémon load, searching by name filters the list, Add puts a Pokémon on your team (no duplicates), Remove takes it off, and Add stops working at 6/6.

Saving teams is not built yet.

### Postman

Test the table endpoints in Postman with this URL format:

http://localhost:5000/api/endpoint

Endpoint names match the files in `server/src/routes/data/` without the `.js` extension. For example, a GET request to http://localhost:5000/api/Generation returns the rows in the `Generation` table.

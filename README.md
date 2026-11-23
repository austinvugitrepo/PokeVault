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

The database values are already filled in and match the Docker database in step 2:

```
PGHOST=localhost
PGPORT=5442
PGUSER=postgres
PGDATABASE=PokeVault
```

The server loads this file on startup, and Docker reads the password from it too. Never commit `.env` or any real passwords.

### 2. Start the database

```bash
docker compose -f database/docker-compose.yml --env-file server/.env up -d
```

This starts PostgreSQL in the background on `localhost:5442` with an empty `PokeVault` database owned by `postgres`. Stop it with the same command, using `down` instead of `up -d`.

### 3. Create and fill the tables

The Team Builder needs the `Generation` and `PokemonID` tables, loaded in this order because `PokemonID` depends on `Generation`. Register and login need the `User` table.

bash:

```bash
for f in Generation_Table_Creation_Script.sql Generation_Table_Population_Script.sql PokemonID_Table_Creation_Script.sql PokemonID_Table_Population_Script_Gen1.sql User_Table_Creation_Script.sql; do
  docker compose -f database/docker-compose.yml --env-file server/.env exec -T postgres psql -U postgres -d PokeVault < "$f"
done
```

PowerShell:

```powershell
$OutputEncoding = [System.Text.UTF8Encoding]::new()
foreach ($f in 'Generation_Table_Creation_Script.sql','Generation_Table_Population_Script.sql','PokemonID_Table_Creation_Script.sql','PokemonID_Table_Population_Script_Gen1.sql','User_Table_Creation_Script.sql') {
  Get-Content -Raw -Encoding UTF8 $f | docker compose -f database/docker-compose.yml --env-file server/.env exec -T postgres psql -U postgres -d PokeVault
}
```

Run this step once; running it again gives "already exists" and duplicate key errors.

Using your own PostgreSQL install instead (for example with pgAdmin)? Set it up with the same values and run the same scripts in its Query Tool.

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

Open up the Postman application and test the endpoints with SQL Queries with the following link format:

http://localhost:5000/api/endpoint

Endpoints should match the name of the /routes/data js files without the js extension

Example:

Do a GET Request (You should see 1 test entry in the result box)

http://localhost:5000/api/Generation

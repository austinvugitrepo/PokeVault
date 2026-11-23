# PostgreSQL

`docker-compose.yml` starts PostgreSQL 16 with an empty database named `PokeVault` and a role named `postgres`. Table creation and population scripts live in the repository root (`*.sql`). After those scripts are loaded, the Express API uses this database for accounts, Team Builder data, and the `/api/*` table routes. The Pokedex still reads Pokémon data from the public PokeAPI.

Set `POKEVAULT_DB_PASSWORD` in `server/.env` before starting. Do not commit that value. Full setup steps are in the root README.

From the repo root:

```bash
docker compose -f database/docker-compose.yml --env-file server/.env up -d
```

PostgreSQL listens on `127.0.0.1:5442`. The `PokeVault` database starts empty; load the table scripts with step 3 in the root README.

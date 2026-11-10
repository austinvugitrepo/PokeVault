# PostgreSQL

Schema is deferred.

No tables, columns, or seed data are defined in this repository. The React app reads Pokemon names from the public PokeAPI. This setup does not connect the app to PostgreSQL.

`docker-compose.yml` starts PostgreSQL 16 with an empty database named `pokevault` and a role named `pokevault`. No SQL files are included.

Set `POKEVAULT_DB_PASSWORD` in your shell before starting. Do not commit that value.

```bash
docker compose up
```

Run the command from this directory. PostgreSQL listens on `127.0.0.1:5432`. The `pokevault` database is created with no application tables.

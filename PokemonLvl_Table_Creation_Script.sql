CREATE TABLE public."PokemonLvl"
(
	PokemonLvlID int PRIMARY KEY,
	PokemonID int NOT NULL,

	Level int NOT NULL,
	Nickname varchar(255) NOT NULL,
	Notes varchar(255) NOT NULL,

	FOREIGN KEY (PokemonID) REFERENCES public."PokemonID"(PokemonID)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."PokemonLvl"
    OWNER to postgres;

COMMENT ON TABLE public."PokemonLvl"
    IS 'Information of Pokemon Levels
';
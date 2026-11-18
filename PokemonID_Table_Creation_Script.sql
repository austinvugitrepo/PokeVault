-- Table: public.PokemonID

-- DROP TABLE IF EXISTS public."PokemonID";

CREATE TABLE IF NOT EXISTS public."PokemonID"
(
	PokemonID int PRIMARY KEY,
	Name varchar(255) NOT NULL,
	GenerationID int NOT NULL,
	Health int NOT NULL,
	Attack int NOT NULL,
	Defence int NOT NULL,
	Special_Attack int NOT NULL,
	Special_Defence int NOT NULL,
	Speed int NOT NULL,

	FOREIGN KEY (GenerationID) REFERENCES public."Generation"(GenerationID)
	
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."PokemonID"
    OWNER to postgres;

COMMENT ON TABLE public."PokemonID"
    IS 'Stores general information about the Pokemon
';

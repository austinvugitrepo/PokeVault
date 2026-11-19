-- Table: public.PokemonLvl

-- DROP TABLE IF EXISTS public."PokemonLvl";

CREATE TABLE IF NOT EXISTS public."PokemonLvl"
(
    pokemonlvlid integer NOT NULL,
    "expToNextLevel" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PokemonLvl_pkey" PRIMARY KEY (pokemonlvlid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."PokemonLvl"
    OWNER to postgres;

COMMENT ON TABLE public."PokemonLvl"
    IS 'Information of Pokemon Levels
';

CREATE TABLE public."TeamMember"
(
	TeamConfigID int NOT NULL,
	PokemonLvlID int NOT NULL,
	TeamSlot int NOT NULL,

	PRIMARY KEY (TeamConfigID, PokemonLvlID),

	FOREIGN KEY (TeamConfigID) REFERENCES public."TeamConfiguration"(TeamConfigID),
	FOREIGN KEY (PokemonLvlID) REFERENCES public."PokemonLvl"(PokemonLvlID)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."TeamMember"
    OWNER to postgres;

COMMENT ON TABLE public."TeamMember"
    IS 'Stores general information about the Pokemon
';
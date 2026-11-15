CREATE TABLE public."Pokemon_Type_Map"
(
	PokemonID int NOT NULL,
	TypeID int NOT NULL,

	PRIMARY KEY (PokemonID, TypeID),

	FOREIGN KEY (PokemonID) REFERENCES public."PokemonID",
	FOREIGN KEY (TypeID) REFERENCES public."Pokemon_Type"
)


TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Pokemon_Type_Map"
    OWNER to postgres;

COMMENT ON TABLE public."Pokemon_Type_Map"
    IS 'Maps out type weaknesses and strengths
';
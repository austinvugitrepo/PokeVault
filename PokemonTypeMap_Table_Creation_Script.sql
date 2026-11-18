CREATE TABLE public."Pokemon_Type_Map"
(
	PokemonID int NOT NULL,
	TypeID int NOT NULL,
	TypeID2 int NOT NULL,

	PRIMARY KEY (PokemonID, TypeID, TypeID2),

	FOREIGN KEY (PokemonID) REFERENCES public."PokemonID"(PokemonID),
	FOREIGN KEY (TypeID) REFERENCES public."Pokemon_Type"(TypeID),
	FOREIGN KEY (TypeID2) REFERENCES public."Pokemon_Type"(TypeID)
)


TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Pokemon_Type_Map"
    OWNER to postgres;

COMMENT ON TABLE public."Pokemon_Type_Map"
    IS 'Maps out type weaknesses and strengths
';

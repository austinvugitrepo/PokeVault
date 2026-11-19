CREATE TABLE public."Pokemon_Ability_Map"
(

	PokemonID int NOT NULL,
	AbilityID int NOT NULL,
	AbilityID2 int NOT NULL,

	PRIMARY KEY (PokemonId, AbilityID, AbilityID2),

	FOREIGN KEY (PokemonID) REFERENCES public."PokemonID"(PokemonID),
	FOREIGN KEY (AbilityID) REFERENCES public."Pokemon_Ability"(AbilityID),
	FOREIGN KEY (AbilityID2) REFERENCES public."Pokemon_Ability"(AbilityID)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Pokemon_Ability_Map"
    OWNER to postgres;

COMMENT ON TABLE public."Pokemon_Ability_Map"
    IS 'Maps Abilities
';

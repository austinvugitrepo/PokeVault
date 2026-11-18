CREATE TABLE public."Pokemon_Ability_Map"
(

	PokemonID int NOT NULL,
	AbilityID varchar(255) NOT NULL,

	PRIMARY KEY (PokemonId, AbilityID),

	FOREIGN KEY (PokemonID) REFERENCES public."PokemonID"(PokemonID),
	FOREIGN KEY (AbilityID) REFERENCES public."Pokemon_Ability"(AbilityID)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Pokemon_Ability_Map"
    OWNER to postgres;

COMMENT ON TABLE public."Pokemon_Ability_Map"
    IS 'Maps Abilities
';

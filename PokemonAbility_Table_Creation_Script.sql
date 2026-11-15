CREATE TABLE public."Pokemon_Ability"
(

	AbilityID int PRIMARY KEY,
	Name varchar(255) NOT NULL,
	Description varchar(255) NOT NULL

)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Pokemon_Ability"
    OWNER to postgres;

COMMENT ON TABLE public."Pokemon_Ability"
    IS 'Stores general information about the Pokemon
';
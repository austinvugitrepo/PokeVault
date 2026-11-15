CREATE TABLE public."Generation" 
(
	GenerationID int PRIMARY KEY,
	Name varchar(255) NOT NULL,
	Description varchar(255) NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Generation"
    OWNER to postgres;

COMMENT ON TABLE public."Generation"
    IS 'Store Information about the different Pokemon Generations';
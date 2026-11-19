CREATE TABLE public."Pokemon_Type"
(
	TypeID int PRIMARY KEY,
	NAME varchar(255) NOT NULL,
	Description varchar(255) NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Pokemon_Type"
    OWNER to postgres;

COMMENT ON TABLE public."Pokemon_Type"
    IS 'Store Information on the different Pokemon types
';
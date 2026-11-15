CREATE TABLE public."User"
(

	UserID int PRIMARY KEY,
	Username varchar(255) NOT NULL,
	Email varchar(255) NOT NULL,
	PasswordHash varchar(255) NOT NULL,
	CreatedAt Date NOT NULL
	
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."User"
    OWNER to postgres;

COMMENT ON TABLE public."User"
    IS 'Stores User Information
';
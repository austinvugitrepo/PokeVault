CREATE TABLE public."TeamConfiguration"
(

	TeamConfigID int PRIMARY KEY,
	UserID int NOT NULL,
	Name varchar(255) NOT NULL,
	Description varchar(255) NOT NULL,
	CreatedAt Date NOT NULL,

	FOREIGN KEY (UserID) REFERENCES public."User"(UserID)

)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."TeamConfiguration"
    OWNER to postgres;

COMMENT ON TABLE public."TeamConfiguration"
    IS 'Stores team configuration information
';
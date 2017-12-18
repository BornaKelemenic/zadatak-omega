CREATE TABLE [dbo].[Brojevi]
(
	[id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [idOsoba] INT NOT NULL, 
    [idVrsta] INT NOT NULL, 
    [broj] NVARCHAR(20) NULL, 
    [opis] NVARCHAR(150) NULL,
	CONSTRAINT Brojevi_fk1 FOREIGN KEY (idOsoba) REFERENCES dbo.Osobe(id), 
    CONSTRAINT [Brojevi_fk2] FOREIGN KEY (idVrsta) REFERENCES dbo.Vrste(id)
)

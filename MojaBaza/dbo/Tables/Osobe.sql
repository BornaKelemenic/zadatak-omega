CREATE TABLE [dbo].[Osobe]
(
	[id] INT NOT NULL PRIMARY KEY IDENTITY,
    [ime] NVARCHAR(150) NULL, 
    [prezime] NVARCHAR(150) NULL, 
    [grad] NVARCHAR(150) NULL, 
    [opis] NVARCHAR(150) NULL, 
    [slika] NVARCHAR(MAX) NULL, 
    [brojevi] NVARCHAR(MAX) NULL
)

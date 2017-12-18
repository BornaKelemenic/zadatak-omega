CREATE PROCEDURE [dbo].[dohvatiKontakt]
	@id int
AS
	select * 
	from dbo.Osobe
	where id = @id;

	select b.*, v.naziv as vrsta
	from dbo.Brojevi as b
	inner join dbo.Vrste as v
	on b.idVrsta = v.id
	where b.idOsoba = @id;

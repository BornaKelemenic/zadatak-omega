CREATE PROCEDURE [dbo].[obrisiKontakt]
	@id int
AS
	delete from dbo.Osobe
	where id = @id;

	delete from dbo.Brojevi
	where idOsoba = @id;
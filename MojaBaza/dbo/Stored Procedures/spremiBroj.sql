CREATE PROCEDURE [dbo].[spremiBroj]
	@id int,
	@idOsoba int,
	@idVrsta int,
	@broj nvarchar(MAX),
	@opis nvarchar(MAX)
AS
begin
	if (@id = -1)
	begin
		insert into dbo.Brojevi (idOsoba, idVrsta, broj, opis)
		values (@idOsoba, @idVrsta, @broj, @opis);
	end
	else
	begin
		update dbo.Brojevi
		set idOsoba = @idOsoba,
		idVrsta = @idVrsta,
		broj = @broj,
		opis = @opis
		where id = @id
	end
end
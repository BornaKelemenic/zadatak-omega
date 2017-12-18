CREATE PROCEDURE [dbo].[spremiKontakt]
	@id int,
	@ime nvarchar(MAX),
	@prezime nvarchar(MAX),
	@grad nvarchar(MAX),
	@opis nvarchar(MAX),
	@slika nvarchar(MAX),
	@brojeviJSON nvarchar(MAX)
AS

begin
	if(@id = -1)
	begin
		insert into dbo.Osobe(ime, prezime, grad, opis, slika, brojevi) 
			values (@ime, @prezime, @grad, @opis, @slika, @brojeviJSON);

		set @id = SCOPE_IDENTITY();
	end
	else
	begin
		update dbo.Osobe 
		set ime = @ime,
		prezime = @prezime,
		grad = @grad,
		opis = @opis,
		slika = @slika,
		brojevi = @brojeviJSON
		where id = @id
	end

	select @id;
end
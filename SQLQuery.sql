
declare @i int = 0;
declare @n int = 20;
declare @noviID int;
declare @noviIDBroj int;
declare @noviBroj nvarchar(MAX);

while @i < @n
begin 
	insert into dbo.Osobe (ime, prezime, grad, opis, slika, brojevi)
	select top 1 ime, prezime, grad, opis, slika, brojevi 
	from dbo.Osobe
	order by NEWID();

	set @noviID = SCOPE_IDENTITY();

	insert into dbo.Brojevi (idOsoba, idVrsta, broj, opis)
	select top 1 @noviID, ((CAST((RAND() * 100) as int) % 3) + 1), broj, opis 
	from dbo.Brojevi
	order by NEWID();

	set @noviIDBroj = SCOPE_IDENTITY();

	update dbo.Osobe
	set brojevi = b.broj
	from dbo.Brojevi as b
	inner join dbo.Osobe as o
	on b.idOsoba = o.id
	where b.id = @noviIDBroj and o.id = @noviID

	set @i += 1;
end

select * from dbo.Osobe
select * from Brojevi


delete from dbo.Brojevi;
delete from dbo.Osobe;

insert into dbo.Osobe (id, ime, prezime, grad, opis, slika, brojevi)
select id, ime, prezime, grad, opis, slika, brojevi from dbo.BackupOsobe;


insert into dbo.Brojevi(id, idOsoba, idVrsta, broj, opis)
select id, idOsoba, idVrsta, broj, opis from dbo.BackupBrojevi;


SET IDENTITY_INSERT dbo.Brojevi OFF
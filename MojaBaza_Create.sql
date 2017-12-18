﻿/*
Deployment script for MojaBaza

This code was generated by a tool.
Changes to this file may cause incorrect behavior and will be lost if
the code is regenerated.
*/

GO
SET ANSI_NULLS, ANSI_PADDING, ANSI_WARNINGS, ARITHABORT, CONCAT_NULL_YIELDS_NULL, QUOTED_IDENTIFIER ON;

SET NUMERIC_ROUNDABORT OFF;


GO
:setvar DatabaseName "MojaBaza"
:setvar DefaultFilePrefix "MojaBaza"
:setvar DefaultDataPath ""
:setvar DefaultLogPath ""

GO
:on error exit
GO
/*
Detect SQLCMD mode and disable script execution if SQLCMD mode is not supported.
To re-enable the script after enabling SQLCMD mode, execute the following:
SET NOEXEC OFF; 
*/
:setvar __IsSqlCmdEnabled "True"
GO
IF N'$(__IsSqlCmdEnabled)' NOT LIKE N'True'
    BEGIN
        PRINT N'SQLCMD mode must be enabled to successfully execute this script.';
        SET NOEXEC ON;
    END


GO
USE [master];


GO

IF (DB_ID(N'$(DatabaseName)') IS NOT NULL) 
BEGIN
    ALTER DATABASE [$(DatabaseName)]
    SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [$(DatabaseName)];
END

GO
PRINT N'Creating $(DatabaseName)...'
GO
CREATE DATABASE [$(DatabaseName)] COLLATE SQL_Latin1_General_CP1_CI_AS
GO
USE [$(DatabaseName)];


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET ANSI_NULLS ON,
                ANSI_PADDING ON,
                ANSI_WARNINGS ON,
                ARITHABORT ON,
                CONCAT_NULL_YIELDS_NULL ON,
                NUMERIC_ROUNDABORT OFF,
                QUOTED_IDENTIFIER ON,
                ANSI_NULL_DEFAULT ON,
                CURSOR_DEFAULT LOCAL,
                RECOVERY FULL,
                CURSOR_CLOSE_ON_COMMIT OFF,
                AUTO_CREATE_STATISTICS ON,
                AUTO_SHRINK OFF,
                AUTO_UPDATE_STATISTICS ON,
                RECURSIVE_TRIGGERS OFF 
            WITH ROLLBACK IMMEDIATE;
        ALTER DATABASE [$(DatabaseName)]
            SET AUTO_CLOSE OFF 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET ALLOW_SNAPSHOT_ISOLATION OFF;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET READ_COMMITTED_SNAPSHOT OFF 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET AUTO_UPDATE_STATISTICS_ASYNC OFF,
                PAGE_VERIFY NONE,
                DATE_CORRELATION_OPTIMIZATION OFF,
                DISABLE_BROKER,
                PARAMETERIZATION SIMPLE,
                SUPPLEMENTAL_LOGGING OFF 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF IS_SRVROLEMEMBER(N'sysadmin') = 1
    BEGIN
        IF EXISTS (SELECT 1
                   FROM   [master].[dbo].[sysdatabases]
                   WHERE  [name] = N'$(DatabaseName)')
            BEGIN
                EXECUTE sp_executesql N'ALTER DATABASE [$(DatabaseName)]
    SET TRUSTWORTHY OFF,
        DB_CHAINING OFF 
    WITH ROLLBACK IMMEDIATE';
            END
    END
ELSE
    BEGIN
        PRINT N'The database settings cannot be modified. You must be a SysAdmin to apply these settings.';
    END


GO
IF IS_SRVROLEMEMBER(N'sysadmin') = 1
    BEGIN
        IF EXISTS (SELECT 1
                   FROM   [master].[dbo].[sysdatabases]
                   WHERE  [name] = N'$(DatabaseName)')
            BEGIN
                EXECUTE sp_executesql N'ALTER DATABASE [$(DatabaseName)]
    SET HONOR_BROKER_PRIORITY OFF 
    WITH ROLLBACK IMMEDIATE';
            END
    END
ELSE
    BEGIN
        PRINT N'The database settings cannot be modified. You must be a SysAdmin to apply these settings.';
    END


GO
ALTER DATABASE [$(DatabaseName)]
    SET TARGET_RECOVERY_TIME = 0 SECONDS 
    WITH ROLLBACK IMMEDIATE;


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET FILESTREAM(NON_TRANSACTED_ACCESS = OFF),
                CONTAINMENT = NONE 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET AUTO_CREATE_STATISTICS ON(INCREMENTAL = OFF),
                MEMORY_OPTIMIZED_ELEVATE_TO_SNAPSHOT = OFF,
                DELAYED_DURABILITY = DISABLED 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET QUERY_STORE (QUERY_CAPTURE_MODE = ALL, DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_PLANS_PER_QUERY = 200, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 367), MAX_STORAGE_SIZE_MB = 100) 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET QUERY_STORE = OFF 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
        ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
        ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
        ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
        ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
        ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
        ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
        ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
    END


GO
IF fulltextserviceproperty(N'IsFulltextInstalled') = 1
    EXECUTE sp_fulltext_database 'enable';


GO
PRINT N'Creating [dbo].[Osobe]...';


GO
CREATE TABLE [dbo].[Osobe] (
    [id]      INT            IDENTITY (1, 1) NOT NULL,
    [ime]     NVARCHAR (150) NULL,
    [prezime] NVARCHAR (150) NULL,
    [grad]    NVARCHAR (150) NULL,
    [opis]    NVARCHAR (150) NULL,
    [slika]   NVARCHAR (MAX) NULL,
    [brojevi] NVARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);


GO
PRINT N'Creating [dbo].[Vrste]...';


GO
CREATE TABLE [dbo].[Vrste] (
    [id]    INT            IDENTITY (1, 1) NOT NULL,
    [naziv] NVARCHAR (150) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);


GO
PRINT N'Creating [dbo].[Brojevi]...';


GO
CREATE TABLE [dbo].[Brojevi] (
    [id]      INT            IDENTITY (1, 1) NOT NULL,
    [idOsoba] INT            NOT NULL,
    [idVrsta] INT            NOT NULL,
    [broj]    NVARCHAR (20)  NULL,
    [opis]    NVARCHAR (150) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);


GO
PRINT N'Creating [dbo].[Brojevi_fk1]...';


GO
ALTER TABLE [dbo].[Brojevi]
    ADD CONSTRAINT [Brojevi_fk1] FOREIGN KEY ([idOsoba]) REFERENCES [dbo].[Osobe] ([id]);


GO
PRINT N'Creating [dbo].[Brojevi_fk2]...';


GO
ALTER TABLE [dbo].[Brojevi]
    ADD CONSTRAINT [Brojevi_fk2] FOREIGN KEY ([idVrsta]) REFERENCES [dbo].[Vrste] ([id]);


GO
PRINT N'Creating [dbo].[dohvatiOsobe]...';


GO
CREATE PROCEDURE [dbo].[dohvatiOsobe]
AS
	SELECT * 
	FROM Osobe;
GO
PRINT N'Creating [dbo].[dohvatiVrste]...';


GO
CREATE PROCEDURE [dbo].[dohvatiVrste]
AS
	SELECT * 
	from dbo.Vrste
GO
PRINT N'Creating [dbo].[spremiKontakt]...';


GO
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
GO
PRINT N'Creating [dbo].[spremiBroj]...';


GO
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
GO
PRINT N'Creating [dbo].[obrisiKontakt]...';


GO
CREATE PROCEDURE [dbo].[obrisiKontakt]
	@id int
AS
	delete from dbo.Osobe
	where id = @id;

	delete from dbo.Brojevi
	where idOsoba = @id;
GO
PRINT N'Creating [dbo].[dohvatiKontakt]...';


GO
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
GO
PRINT N'Creating [dbo].[napuniPodatke]...';


GO
CREATE PROCEDURE [dbo].[napuniPodatke]
	@param1 int = 0,
	@param2 int
AS
	SELECT @param1, @param2
RETURN 0
GO
DECLARE @VarDecimalSupported AS BIT;

SELECT @VarDecimalSupported = 0;

IF ((ServerProperty(N'EngineEdition') = 3)
    AND (((@@microsoftversion / power(2, 24) = 9)
          AND (@@microsoftversion & 0xffff >= 3024))
         OR ((@@microsoftversion / power(2, 24) = 10)
             AND (@@microsoftversion & 0xffff >= 1600))))
    SELECT @VarDecimalSupported = 1;

IF (@VarDecimalSupported > 0)
    BEGIN
        EXECUTE sp_db_vardecimal_storage_format N'$(DatabaseName)', 'ON';
    END


GO
ALTER DATABASE [$(DatabaseName)]
    SET MULTI_USER 
    WITH ROLLBACK IMMEDIATE;


GO
PRINT N'Update complete.';


GO

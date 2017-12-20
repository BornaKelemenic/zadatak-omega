using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Dapper;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;

namespace telefonski_imenik.Controllers
{
    [Produces("application/json")]    
    public class ContactsController : ControllerBase
    {
        public SqlConnection myConnection = new SqlConnection("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=mojaBaza;Integrated Security=True;Encrypt=False;TrustServerCertificate=True;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");

        [Route("/api/get")]
        public IEnumerable<Osobe> getContacts()
        {
            using (myConnection)
            {
                return myConnection.Query<Osobe>("dbo.dohvatiOsobe", new { }, commandType: CommandType.StoredProcedure);
            }
        }

        [Route("/api/vrste")]
        public IEnumerable<Vrste> getVrste()
        {
            using (myConnection)
            {
                return myConnection.Query<Vrste>("dbo.dohvatiVrste", new { }, commandType: CommandType.StoredProcedure);
            }
        }

        [Route("/api/spremiOsobu"), HttpPost]
        public void spremiOsobu(Osobe osoba)
        {
            using (myConnection)
            {
                myConnection.Execute("dbo.spremiKontakt", new
                {
                    id = -1,
                    ime = osoba.ime,
                    prezime = osoba.prezime,
                    grad = osoba.grad,
                    opis = osoba.opis,
                    slika = osoba.slika,
                    brojeviJSON = ""
                }, commandType: CommandType.StoredProcedure);
            }
        }

        [Route("/api/spremiBrojeve"), HttpPost]
        public Brojevi[] spremiBrojeve(Brojevi[] brojevi)
        {
            using (myConnection)
            {
                return brojevi;
            }
        }

        [Route("/api/spremiKontakt"), HttpPost]
        public int spremiKontakt(Kontakt kontakt)
        {
            int idOsoba = -1;
            string sviBrojevi = "";

            if (kontakt.brojevi != null) // Ako postoje vrijednosti u brojevi array-u
            {
                int n = kontakt.brojevi.Length;
                int i = 0;
                foreach (var broj in kontakt.brojevi)
                {
                    if (i == n - 1) // Ako je zadnji broj, ne dodaje se zarez
                    {
                        sviBrojevi += broj.broj;
                    }
                    else
                        sviBrojevi += broj.broj + ", ";

                    i++;
                }
            }            

            using (myConnection)
            {
                // U idOsoba varijablu se sprema id spremljene osobe
                idOsoba = myConnection.QueryFirstOrDefault<int>("dbo.spremiKontakt", new
                {
                    id = kontakt.osoba.id,
                    ime = kontakt.osoba.ime,
                    prezime = kontakt.osoba.prezime,
                    grad = kontakt.osoba.grad,
                    opis = kontakt.osoba.opis,
                    slika = kontakt.osoba.slika,
                    brojeviJSON = sviBrojevi
                }, commandType: CommandType.StoredProcedure);

                if (kontakt.brojevi != null) // Ako postoje vrijednosti u brojevi array-u
                {
                    foreach (var broj in kontakt.brojevi) // Za svaki broj spremi podatke za brojeve sa od prije dohvaćenim id-jem osobe
                    {
                        myConnection.Execute("dbo.spremiBroj", new
                        {
                            id = broj.id,
                            idOsoba = idOsoba,
                            idVrsta = broj.idVrsta,
                            broj = broj.broj,
                            opis = broj.opis
                        }, commandType: CommandType.StoredProcedure);
                    }
                }
                else // Ako nema vrijednosti u .brojevi znači da su pobrisani
                {
                    myConnection.Execute("DELETE FROM dbo.Brojevi WHERE idOsoba = " + idOsoba, new { }, commandType: CommandType.Text);
                }
            }

            return idOsoba; // Vraća se id osobe koja je bila kreirana ili uređena (za testiranje)
        }

        [Route("/api/osoba/{id}")]
        public Kontakt dohvatiKontakt(int id)
        {
            using (myConnection)
            {
                // Dohvati kontakt po id-u
                using (var k = myConnection.QueryMultiple("dbo.dohvatiKontakt", new { id = id }, commandType: CommandType.StoredProcedure))
                {
                    Osobe osoba = k.ReadSingle<Osobe>();
                    Brojevi[] brojevi = k.Read<Brojevi>().ToArray();

                    Kontakt kontakt = new Kontakt
                    {
                        osoba = osoba,
                        brojevi = brojevi
                    };
                    // Vrati podatke o kontaktu
                    return kontakt;
                }
            }
        }

        [Route("api/osoba/{id}"), HttpDelete]
        public void obrisiKontakt(int id)
        {
            using (myConnection)
            {
                myConnection.Execute("dbo.obrisiKontakt", new { id = id }, commandType: CommandType.StoredProcedure);
            }
        }
    }

    // Modeli

    public class Kontakt
    {
        public Osobe osoba { get; set; }
        public Brojevi[] brojevi { get; set; }
    }

    public class Osobe
    {
        public int id { get; set; }
        public string ime { get; set; }
        public string prezime { get; set; }
        public string grad { get; set; }
        public string opis { get; set; }
        public string slika { get; set; }
        public string brojevi { get; set; }
    }

    public class Vrste
    {
        public int id { get; set; }
        public string naziv { get; set; }
    }

    public class Brojevi
    {
        public int id { get; set; }
        public int idOsoba { get; set; }
        public int idVrsta { get; set; }
        public string broj { get; set; }
        public string opis { get; set; }
        public string vrsta { get; set; }
    }
}
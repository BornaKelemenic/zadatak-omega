module Index
{
    let mojaTablica: DataTables.DataTable;
    let addBrojBtn: HTMLButtonElement;
    let validator: JQueryValidation.Validator;

    export function start()
    {
        // Kreiranje datatablice
        mojaTablica = $('#mojaTablica').DataTable({
            data: [],
            // Definiranje stupaca u tablici
            columns: [
                { data: "ime", title: "Ime" },
                { data: "prezime", title: "Prezime" },
                {
                    data: "grad",
                    title: "Grad"
                },
                {
                    data: "brojevi",
                    title: "Svi Brojevi"
                },
                {
                    data: "id",
                    title: "Akcije",
                    render: (data) => {
                        // Gumbi za prikaz detalja kontakta, uređivanje kontakta i brisanje kontakta
                        return '<button type="button" class="btn btn-sm btn-info" onclick="Index.otvoriModal(' + data +');">VIEW</button> <button type="button" class="btn btn-sm btn-warning" onclick="Index.upaliFormu(' + data + ')">EDIT</button> <button type="button" class="btn btn-sm btn-danger" onclick="Index.obrisiKontakt(' + data + ')">DELETE</button>';
                    }
                }
            ]
        });
        
        getContacts();
        getVrste();

        // Dohvati addBrojBtn gumb i nadodaj click listener koji poziva funkciju za dodavanje novog unosa broja
        addBrojBtn = document.getElementById('addBrojBtn') as HTMLButtonElement;
        $(addBrojBtn).on('click', function() {
            dodajNoviUnosBroja();
        });

        // jQuery Validator
        validator = $('#kontaktForma').validate();
    }

    /**
     * Popuni tablicu sa kontaktima iz baze
     */
    export function getContacts()
    {
        queryBazu('/api/get', 'GET', null, (data) => {
            mojaTablica.clear().rows.add(data).draw();
        });
    }

    /**
     * Dohvati moguće vrste telefona iz baze
     */
    export function getVrste()
    {
        queryBazu('/api/vrste', 'GET', null, (data: Models.IVrste[]) => {
            if (data)
            {
                // Za svaku vrstu telefona nadodaj option element u select element
                data.forEach(value => {
                    let option: HTMLOptionElement = document.createElement('option');
                    option.value = value.id.toString();
                    option.innerHTML = value.naziv;

                    $('#template select').append(option);
                });
            }
        });
    }

    /**
     * Funkcija za dodavanje novog retka za unos broja
     */
    export function dodajNoviUnosBroja()
    {
        $('#unos-brojeva').append($('#template').html());
        validator = $('#kontaktForma').validate();
    }

    /**
     * Funkcija za brisanje retka unosa broja iz forme
     * @param element Element koji će se obrisati
     */
    export function izbrisiRedak(element)
    {
        $(element).parent().parent().remove();
    }

    /**
     * Custom funkcija za query baze
     * @param url
     * @param tip_zahtjeva
     * @param body
     * @param callback
     */
    export function queryBazu(url: string, tip_zahtjeva: string, body: any, callback: (data)=>void)
    {
        $.ajax({
            url: url,
            method: tip_zahtjeva,
            data: body,
            success: callback
        });
    }

    /**
     * Funkcija koja dohvaća unešene podatke iz forme.
     * Kreira novi Kontakt objekt i šalje ga u bazu
     */
    export function dohvatiPodatkeForme()
    {
        if ($('#kontaktForma').valid()) // Ako je forma validna
        {
            let osoba: Models.IOsobe;
            let sviBrojevi: Models.IBrojevi[] = [];

            // Svaki redak iz forme unosa brojeva spremi u sviBrojevi
            $('#unos-brojeva .row').each((i, element) => {
                sviBrojevi.push({
                    id: parseInt($(element).find('[name=idBroj]').attr('value')), // Dohvati skriveno polje ID, biti će -1 ako je novi broj
                    idOsoba: $('[name=id]').val() as number, // Dohvati skriveno polje id kojemu pripada unešeni broj
                    idVrsta: $(element).find('select').val() as number,
                    broj: $(element).find('[name=broj]').val().toString(),
                    opis: $(element).find('[name=opisBroj]').val().toString()
                });
            });

            // Kreacija objekta osobe
            osoba = {
                id: $('[name=id]').val() as number, // Skriveno polje id-a osobe. Biti će prazno ako se unosi novi kontakt
                ime: $('#kontaktForma').find('[name=ime]').val().toString(),
                prezime: $('#kontaktForma').find('[name=prezime]').val().toString(),
                grad: $('#kontaktForma').find('[name=grad]').val().toString(),
                opis: $('#kontaktForma').find('[name=opis]').val().toString(),
                slika: $('#kontaktForma').find('[name=slika]').val().toString(),
                brojevi: ''
            }

            // Kontakt model
            let kontakt: Models.IKontakt = {
                osoba: osoba,
                brojevi: sviBrojevi
            };

            // POST na bazu sa podacima o kontaktu
            $.post('/api/spremiKontakt', { kontakt: kontakt }, (data) => {
                console.log(data); // Log id spremljenog kontakta
                getContacts(); // Osvježi tablicu

                /*
                if (data.isError) {
                    new Noty({ text: 'Neuspjeh.', type: 'error', timeout: 5000 }).show();
                }
                else*/
                    new Noty({ text: 'Uspješno spremljen kontakt.', type: 'success', timeout: 5000 }).show();
            });

            // Ugasi formu nakon spremanja ili uređivanja kontakta
            Index.ugasiFormu();
        }
    }

    /**
     * Funkcija za prikazivanje forme unosa novog ili uređivanje postojećeg kontakta
     * Ako je id različit od -1 znači da se dodaje novi kontakt
     * @param idOsoba id kontakta koji se uređuje
     */
    export function upaliFormu(idOsoba: number)
    {

        validator.resetForm(); // Resetiranje forme
        $('#unos-brojeva').empty(); // Brisanje nadodanih redaka za unos broja
        $('#kontaktForma').find('[name=id]').val('');
        $('#kontaktForma').find('[name=ime]').val('');
        $('#kontaktForma').find('[name=prezime]').val('');
        $('#kontaktForma').find('[name=grad]').val('');
        $('#kontaktForma').find('[name=opis]').val('');
        $('#kontaktForma').find('[name=slika]').val('');
        $('#previewSlika').attr('src', '').hide();

        // Postavi id u skirveno polje, biti če -1 ako se dodaje nova osoba
        $('#kontaktForma').find('[name=id]').val(idOsoba);

        // Provjera ako je id različit od -1
        if (idOsoba !== -1)
        {
            queryBazu(`api/osoba/${idOsoba}`, 'GET', null, (data: Models.IKontakt) =>
            {
                // Punjenje input polja s podacima
                $('#kontaktForma').find('[name=id]').val(data.osoba.id);
                $('#kontaktForma').find('[name=ime]').val(data.osoba.ime);
                $('#kontaktForma').find('[name=prezime]').val(data.osoba.prezime);
                $('#kontaktForma').find('[name=grad]').val(data.osoba.grad);
                $('#kontaktForma').find('[name=opis]').val(data.osoba.opis);
                $('#kontaktForma').find('[name=slika]').val(data.osoba.slika);

                // Za svaki broj kojeg ima kontakt nadodaj novi redak sa formom za unos broja
                data.brojevi.forEach((value, index) =>
                {
                    let noviElement: JQuery = $($('#template').html());

                    noviElement.find('[name=idBroj]').attr('value', value.id);
                    noviElement.find('[name=vrsta]').val(value.idVrsta);
                    noviElement.find('[name=broj]').val(value.broj);
                    noviElement.find('[name=opisBroj]').val(value.opis);

                    $('#unos-brojeva').append(noviElement);
                });

                // Trigger blur eventa za prikaz preview-a slike
                $('#kontaktForma').find('[name=slika]').trigger('blur');
            });
        }

        // jQuery validator
        validator = $('#kontaktForma').validate();
        // Prikaži formu
        $('#kontaktForma').show();
    }

    /**
     * Sakri formu za unos kontakta
     */
    export function ugasiFormu()
    {
        $('#kontaktForma').hide();
    }

    /**
     * Funkcija za brisanje kontakta iz baze
     * @param id ID kontakta za brisanje
     */
    export function obrisiKontakt(id: number)
    {
        if (confirm('Želite obirsati ?'))
        {
            queryBazu(`api/osoba/${id}`, 'DELETE', null, (data) =>
            {
                if (data.isError)
                {
                    new Noty({ text: 'Neuspjeh.', type: 'error', timeout: 5000 }).show();
                }
                else
                {
                    // Obavijest o radnji i osvježavanje tablice
                    new Noty({ text: 'Uspješno obrisan kontakt.', type: 'success', timeout: 5000 }).show();
                    getContacts();
                }
            });
        }
    }

    /**
     * Funkcija za prikaz modala s detaljima kontakta
     * @param kontaktID id kontakta za prikaz
     */
    export function otvoriModal(kontaktID: number)
    {
        // Prikaži modal
        $('.shadow').show();
        let template = $('#brojeviTemplate').html(); // Dohvati template za prikaz brojeva
        $('#modalBrojeviLista').empty(); // Očisti listu brojeva

        // Dohvat kontakta iz baze
        $.getJSON(`api/osoba/${kontaktID}`, null, (kontakt: Models.IKontakt) =>
        {
            $('#modalIme').html(kontakt.osoba.ime + ' ' + kontakt.osoba.prezime);
            $('#modalGrad').html(kontakt.osoba.grad);
            $('#modalOpis').html(kontakt.osoba.opis);

            if (!kontakt.osoba.slika) // Ako slika ne postoji, iskoristi placeholder sliku
            {
                $('#modalSlika').attr('src', 'https://cdn1.iconfinder.com/data/icons/image-manipulations/100/13-512.png');
            }
            else
            {
                $('#modalSlika').attr('src', kontakt.osoba.slika);
            }

            // Za svaki broj nadodaj prikaz novog reda u listu
            kontakt.brojevi.forEach((value, index) => {
                $('#modalBrojeviLista').append(template
                    .replace('[tip]', value.vrsta ? value.vrsta : '')
                    .replace('[broj]', value.broj ? value.broj : '')
                    .replace('[opisBroj]', value.opis ? value.opis : '')
                );
            });

        });
    }

    /**
     * Dodaj u src atribut img elementa vrijednost iz polja za unos slike
     */
    export function prikaziSliku()
    {
        $('#previewSlika').attr('src', $('[name=slika]').val().toString()).show();
    }
}
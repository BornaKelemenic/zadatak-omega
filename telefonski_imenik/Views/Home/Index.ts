module Index
{
    let mojaTablica: DataTables.DataTable;
    let addBrojBtn: HTMLButtonElement;
    let validator: JQueryValidation.Validator;

    export function start()
    {
        mojaTablica = $('#mojaTablica').DataTable({
            data: [],
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
                        return '<button type="button" class="btn btn-sm btn-info" onclick="Index.otvoriModal(' + data +');">VIEW</button> <button type="button" class="btn btn-sm btn-warning" onclick="Index.upaliFormu(' + data + ')">EDIT</button> <button type="button" class="btn btn-sm btn-danger" onclick="Index.obrisiKontakt(' + data + ')">DELETE</button>';
                    }
                }
            ]
        });

        getContacts();
        getVrste();
        addBrojBtn = document.getElementById('addBrojBtn') as HTMLButtonElement;
        $(addBrojBtn).on('click', function() {
            dodajNoviUnosBroja();
        });
        ugasiFormu();

        validator = $('#kontaktForma').validate();
    }

    export function getContacts()
    {
        queryBazu('/api/get', 'GET', null, (data) => {
            mojaTablica.clear().rows.add(data).draw();
        });
    }

    export function getVrste()
    {
        queryBazu('/api/vrste', 'GET', null, (data: Models.IVrste[]) => {
            if (data)
            {
                data.forEach(value => {
                    let option: HTMLOptionElement = document.createElement('option');
                    option.value = value.id.toString();
                    option.innerHTML = value.naziv;

                    $('#template select').append(option);
                });
            }
        });
    }

    export function dodajNoviUnosBroja()
    {
        $('#unos-brojeva').append($('#template').html());
        validator = $('#kontaktForma').validate();
    }

    export function izbrisiRedak(element)
    {
        $(element).parent().parent().remove();
    }

    export function queryBazu(url: string, tip_zahtjeva: string, body: any, callback: (data)=>void)
    {
        $.ajax({
            url: url,
            method: tip_zahtjeva,
            data: body,
            success: callback
        });
    }

    export function dohvatiPodatkeForme()
    {
        if ($('#kontaktForma').valid())
        {
            let osoba: Models.IOsobe;
            let sviBrojevi: Models.IBrojevi[] = [];

            $('#unos-brojeva .row').each((i, element) => {
                sviBrojevi.push({
                    id: parseInt($(element).find('[name=idBroj]').attr('value')),
                    idOsoba: $('[name=id]').val() as number,
                    idVrsta: $(element).find('select').val() as number,
                    broj: $(element).find('[name=broj]').val().toString(),
                    opis: $(element).find('[name=opisBroj]').val().toString()
                });
            });


            osoba = {
                id: $('[name=id]').val() as number,
                ime: $('#kontaktForma').find('[name=ime]').val().toString(),
                prezime: $('#kontaktForma').find('[name=prezime]').val().toString(),
                grad: $('#kontaktForma').find('[name=grad]').val().toString(),
                opis: $('#kontaktForma').find('[name=opis]').val().toString(),
                slika: $('#kontaktForma').find('[name=slika]').val().toString(),
                brojevi: ''
            }

            let kontakt: Models.IKontakt = {
                osoba: osoba,
                brojevi: sviBrojevi
            };

            $.post('/api/spremiKontakt', { kontakt: kontakt }, (data) => {
                console.log(data);
                getContacts();

                if (data.isError) {
                    new Noty({ text: 'Neuspjeh.', type: 'error', timeout: 5000 }).show();
                }
                else
                    new Noty({ text: 'Uspješno spremljen kontakt.', type: 'success', timeout: 5000 }).show();
            });

            Index.ugasiFormu();
        }
    }

    export function upaliFormu(idOsoba: number)
    {
        validator.resetForm();
        $('#unos-brojeva').empty();
        $('#kontaktForma').find('[name=id]').val('');
        $('#kontaktForma').find('[name=ime]').val('');
        $('#kontaktForma').find('[name=prezime]').val('');
        $('#kontaktForma').find('[name=grad]').val('');
        $('#kontaktForma').find('[name=opis]').val('');
        $('#kontaktForma').find('[name=slika]').val('');
        $('#previewSlika').attr('src', '').hide();


        $('#kontaktForma').find('[name=id]').val(idOsoba);

        if (idOsoba !== -1)
        {
            queryBazu(`api/osoba/${idOsoba}`, 'GET', null, (data: Models.IKontakt) =>
            {
                $('#kontaktForma').find('[name=id]').val(data.osoba.id);
                $('#kontaktForma').find('[name=ime]').val(data.osoba.ime);
                $('#kontaktForma').find('[name=prezime]').val(data.osoba.prezime);
                $('#kontaktForma').find('[name=grad]').val(data.osoba.grad);
                $('#kontaktForma').find('[name=opis]').val(data.osoba.opis);
                $('#kontaktForma').find('[name=slika]').val(data.osoba.slika);

                data.brojevi.forEach((value, index) =>
                {
                    let noviElement: JQuery = $($('#template').html());

                    noviElement.find('[name=idBroj]').attr('value', value.id);
                    noviElement.find('[name=vrsta]').val(value.idVrsta);
                    noviElement.find('[name=broj]').val(value.broj);
                    noviElement.find('[name=opisBroj]').val(value.opis);

                    $('#unos-brojeva').append(noviElement);
                });

                $('#kontaktForma').find('[name=slika]').trigger('blur');
            });
        }

        validator = $('#kontaktForma').validate();

        $('#kontaktForma').show();
    }

    export function ugasiFormu()
    {
        $('#kontaktForma').hide();

    }

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
                    new Noty({ text: 'Uspješno obrisan kontakt.', type: 'success', timeout: 5000 }).show();
                    getContacts();
                }
            });
        }
    }

    export function otvoriModal(kontaktID: number)
    {
        $('.shadow').show();
        let template = $('#brojeviTemplate').html();
        $('#modalBrojeviLista').empty();
        
        $.getJSON(`api/osoba/${kontaktID}`, null, (kontakt: Models.IKontakt) =>
        {
            $('#modalIme').html(kontakt.osoba.ime + ' ' + kontakt.osoba.prezime);
            $('#modalGrad').html(kontakt.osoba.grad);
            $('#modalOpis').html(kontakt.osoba.opis);

            if (!kontakt.osoba.slika)
            {
                $('#modalSlika').attr('src', 'https://cdn1.iconfinder.com/data/icons/image-manipulations/100/13-512.png');
            }
            else
            {
                $('#modalSlika').attr('src', kontakt.osoba.slika);
            }

            kontakt.brojevi.forEach((value, index) => {
                $('#modalBrojeviLista').append(template
                    .replace('[tip]', value.vrsta ? value.vrsta : '')
                    .replace('[broj]', value.broj ? value.broj : '')
                    .replace('[opisBroj]', value.opis ? value.opis : '')
                );
            });

        });
    }

    export function prikaziSliku()
    {
        $('#previewSlika').attr('src', $('[name=slika]').val().toString()).show();
    }
}
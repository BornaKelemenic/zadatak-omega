var Index;
(function (Index) {
    var mojaTablica;
    var addBrojBtn;
    var validator;
    function start() {
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
                    render: function (data) {
                        return '<button type="button" class="btn btn-sm btn-info" onclick="Index.otvoriModal(' + data + ');">VIEW</button> <button type="button" class="btn btn-sm btn-warning" onclick="Index.upaliFormu(' + data + ')">EDIT</button> <button type="button" class="btn btn-sm btn-danger" onclick="Index.obrisiKontakt(' + data + ')">DELETE</button>';
                    }
                }
            ]
        });
        getContacts();
        getVrste();
        addBrojBtn = document.getElementById('addBrojBtn');
        $(addBrojBtn).on('click', function () {
            dodajNoviUnosBroja();
        });
        ugasiFormu();
        validator = $('#kontaktForma').validate();
    }
    Index.start = start;
    function getContacts() {
        queryBazu('/api/get', 'GET', null, function (data) {
            mojaTablica.clear().rows.add(data).draw();
        });
    }
    Index.getContacts = getContacts;
    function getVrste() {
        queryBazu('/api/vrste', 'GET', null, function (data) {
            if (data) {
                data.forEach(function (value) {
                    var option = document.createElement('option');
                    option.value = value.id.toString();
                    option.innerHTML = value.naziv;
                    $('#template select').append(option);
                });
            }
        });
    }
    Index.getVrste = getVrste;
    function dodajNoviUnosBroja() {
        $('#unos-brojeva').append($('#template').html());
        validator = $('#kontaktForma').validate();
    }
    Index.dodajNoviUnosBroja = dodajNoviUnosBroja;
    function izbrisiRedak(element) {
        $(element).parent().parent().remove();
    }
    Index.izbrisiRedak = izbrisiRedak;
    function queryBazu(url, tip_zahtjeva, body, callback) {
        $.ajax({
            url: url,
            method: tip_zahtjeva,
            data: body,
            success: callback
        });
    }
    Index.queryBazu = queryBazu;
    function dohvatiPodatkeForme() {
        if ($('#kontaktForma').valid()) {
            var osoba = void 0;
            var sviBrojevi_1 = [];
            $('#unos-brojeva .row').each(function (i, element) {
                sviBrojevi_1.push({
                    id: parseInt($(element).find('[name=idBroj]').attr('value')),
                    idOsoba: $('[name=id]').val(),
                    idVrsta: $(element).find('select').val(),
                    broj: $(element).find('[name=broj]').val().toString(),
                    opis: $(element).find('[name=opisBroj]').val().toString()
                });
            });
            osoba = {
                id: $('[name=id]').val(),
                ime: $('#kontaktForma').find('[name=ime]').val().toString(),
                prezime: $('#kontaktForma').find('[name=prezime]').val().toString(),
                grad: $('#kontaktForma').find('[name=grad]').val().toString(),
                opis: $('#kontaktForma').find('[name=opis]').val().toString(),
                slika: $('#kontaktForma').find('[name=slika]').val().toString(),
                brojevi: ''
            };
            var kontakt = {
                osoba: osoba,
                brojevi: sviBrojevi_1
            };
            $.post('/api/spremiKontakt', { kontakt: kontakt }, function (data) {
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
    Index.dohvatiPodatkeForme = dohvatiPodatkeForme;
    function upaliFormu(idOsoba) {
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
        if (idOsoba !== -1) {
            queryBazu("api/osoba/" + idOsoba, 'GET', null, function (data) {
                $('#kontaktForma').find('[name=id]').val(data.osoba.id);
                $('#kontaktForma').find('[name=ime]').val(data.osoba.ime);
                $('#kontaktForma').find('[name=prezime]').val(data.osoba.prezime);
                $('#kontaktForma').find('[name=grad]').val(data.osoba.grad);
                $('#kontaktForma').find('[name=opis]').val(data.osoba.opis);
                $('#kontaktForma').find('[name=slika]').val(data.osoba.slika);
                data.brojevi.forEach(function (value, index) {
                    var noviElement = $($('#template').html());
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
    Index.upaliFormu = upaliFormu;
    function ugasiFormu() {
        $('#kontaktForma').hide();
    }
    Index.ugasiFormu = ugasiFormu;
    function obrisiKontakt(id) {
        if (confirm('Želite obirsati ?')) {
            queryBazu("api/osoba/" + id, 'DELETE', null, function (data) {
                if (data.isError) {
                    new Noty({ text: 'Neuspjeh.', type: 'error', timeout: 5000 }).show();
                }
                else {
                    new Noty({ text: 'Uspješno obrisan kontakt.', type: 'success', timeout: 5000 }).show();
                    getContacts();
                }
            });
        }
    }
    Index.obrisiKontakt = obrisiKontakt;
    function otvoriModal(kontaktID) {
        $('.shadow').show();
        var template = $('#brojeviTemplate').html();
        $('#modalBrojeviLista').empty();
        $.getJSON("api/osoba/" + kontaktID, null, function (kontakt) {
            $('#modalIme').html(kontakt.osoba.ime + ' ' + kontakt.osoba.prezime);
            $('#modalGrad').html(kontakt.osoba.grad);
            $('#modalOpis').html(kontakt.osoba.opis);
            if (!kontakt.osoba.slika) {
                $('#modalSlika').attr('src', 'https://cdn1.iconfinder.com/data/icons/image-manipulations/100/13-512.png');
            }
            else {
                $('#modalSlika').attr('src', kontakt.osoba.slika);
            }
            kontakt.brojevi.forEach(function (value, index) {
                $('#modalBrojeviLista').append(template
                    .replace('[tip]', value.vrsta ? value.vrsta : '')
                    .replace('[broj]', value.broj ? value.broj : '')
                    .replace('[opisBroj]', value.opis ? value.opis : ''));
            });
        });
    }
    Index.otvoriModal = otvoriModal;
    function prikaziSliku() {
        $('#previewSlika').attr('src', $('[name=slika]').val().toString()).show();
    }
    Index.prikaziSliku = prikaziSliku;
})(Index || (Index = {}));
//# sourceMappingURL=app.js.map
module Index.Models
{
    export interface IVrste
    {
        id: number;
        naziv: string;
    }

    export interface IOsobe
    {
        id: number,
        ime: string,
        prezime: string,
        grad: string,
        opis: string,
        slika: string,
        brojevi: string
    }

    export interface IBrojevi
    {
        id: number,
        idOsoba: number,
        idVrsta: number,
        broj: string,
        opis: string,
        vrsta?: string
    }

    export interface IKontakt
    {
        osoba: IOsobe,
        brojevi: IBrojevi[]
    }
}
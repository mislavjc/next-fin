import LocalizedStrings from 'react-localization';

const Strings = new LocalizedStrings({
  en: {
    hero: {
      title: 'Import your Excel table',
      subtitle:
        'Do you already have entries saved in an Excel spreadsheet? Just attach it below!',
      button: ['Attach the', 'Excel spreadsheet'],
    },
    header: {
      title: 'Input field selection',
      subtitle:
        'According to the selected categories, an on-screen overview of the input field (category) will be made.',
      example: {
        text: 'Example',
        title1: 'Field examples',
        title2: 'Example of a created field entries',
        usage: 'Used',
      },
    },
    formSection: {
      title: 'Field collection name',
      titleField: 'Collection name',
      textField: 'Category name',
      required: 'Required',
      add: 'Add',
      save: 'Save',
    },
    snackbar: {
      invalidFormat: 'Invalid table format!',
    },
  },
  hr: {
    hero: {
      title: 'Prenesite svoje Excel tablice',
      subtitle:
        'Imate unose već spremljene u Excel tablici? Jednostavno je priložite ispod!',
      button: ['Priložite', 'Excel datoteke'],
    },
    header: {
      title: 'Odabir polja za unos',
      subtitle:
        'Prema odabranim kategorijama napraviti će se ekranski pregled polja za unos (kategorija).',
      example: {
        text: 'Primjer',
        title1: 'Primjer polja',
        title2: 'Primjer kreiranog unosa iz polja',
        usage: 'Iskorišteno',
      },
    },
    formSection: {
      title: 'Naziv kolekcije kategorija',
      titleField: 'Naziv kolekcije',
      textField: 'Naziv kategorije',
      required: 'Obavezno',
      add: 'Dodaj',
      save: 'Spremi',
    },
    snackbar: {
      invalidFormat: 'Neispravan format tablice!',
    },
  },
});

export default Strings;

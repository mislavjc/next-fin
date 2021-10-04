import LocalizedStrings from 'react-localization';

const Strings = new LocalizedStrings({
  en: {
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
  },
  hr: {
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
  },
});

export default Strings;

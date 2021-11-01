import LocalizedStrings from 'react-localization';

const Strings = new LocalizedStrings({
  en: {
    formStrings: {
      new: 'New entry',
      edit: 'Edit entry',
      button: 'Save',
      attachment: 'Add a file',
    },
    snackbar: {
      create: "You don't have permission to create this entry!",
      created: 'Entry added!',
      edited: 'Entry changed successfully!'
    },
    totalCount: 'Total'
  },
  hr: {
    formStrings: {
      new: 'Novi unos',
      edit: 'Promjeni unos',
      button: 'Spremi',
      attachment: 'Dodaj datoteku',
    },
    snackbar: {
      create: 'Nemate prava za dodavanje unosa!',
      created: 'Dodan unos!',
      edited: 'Uspješno promjenjen unos!'
    },
    totalCount: 'Ukupno'
  },
});

export default Strings;

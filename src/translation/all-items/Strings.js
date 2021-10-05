import LocalizedStrings from 'react-localization';

const Strings = new LocalizedStrings({
  en: {
    formStrings: {
      new: 'New entry',
      edit: 'Edit entry',
      button: 'Save',
      attachment: 'Add a file',
    },
  },
  hr: {
    formStrings: {
      new: 'Novi unos',
      edit: 'Promjeni unos',
      button: 'Spremi',
      attachment: 'Dodaj datoteku',
    },
  },
});

export default Strings;

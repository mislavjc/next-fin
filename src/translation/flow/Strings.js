import LocalizedStrings from 'react-localization';

const Strings = new LocalizedStrings({
  en: {
    imp: {
      title: 'Import files',
      subtitle: 'Import your Excel files',
    },
    setup: {
      title: 'Manual setup',
      subtitle: 'Setup everything manually',
    },
    button: 'Next',
  },
  hr: {
    imp: {
      title: 'Import datoteke',
      subtitle: 'Prenesite Excel datoteke',
    },
    setup: {
      title: 'Ručno postavljanje',
      subtitle: 'Ručno postavite sve postavke',
    },
    button: 'Dalje',
  },
});

export default Strings;

import LocalizedStrings from 'react-localization';

const Strings = new LocalizedStrings({
  en: {
    accountStrings: {
      welcome: 'Welcome',
      title: 'Change your account settings',
      user: {
        username: 'Username',
        theme: {
          title: 'Theme',
          subtitle: 'Change account theme',
        },
      },
      data: {
        title: 'Data usage',
        subtitle: 'Used 14/15 GB',
        button: 'Change your subscription',
      },
      export: {
        title: 'Data export',
        subtitle: 'Download all your data in a CSV format',
      },
      unarchived: {
        title: 'Entries',
        subtitle: ['Added', 'entries overall'],
      },
      archived: {
        title: 'Archives',
        subtitle: ['Archived', 'entries overall'],
      },
      entriesButton: 'View all entries',
      types: {
        title: 'Categories for adding entries',
        subtitle: ['', 'categories for adding entries chosen'],
      },
      order: {
        title: 'Order of categories',
        subtitle: 'Change the order of categories',
      },
      typeButton: 'Add categories',
      collections: {
        title: 'Added collections',
        subtitle: 'List of added collections',
      },
      users: {
        title: 'Added users',
        subtitle: 'List of users in your organization',
        button: 'Add an user',
      },
      support: {
        title: 'Support',
        subtitle: 'Contact support for help with the usage of application',
      },
      documentation: {
        title: 'Documentation',
        subtitle: 'Search the app usage documentation',
      },
      feedback: {
        title: 'Feedback',
        subtitle: 'Send us feedback',
      },
    },
  },
  hr: {
    accountStrings: {
      welcome: 'Dobrodošao',
      title: 'Promjenite postavke računa',
      user: {
        username: 'Korisničko ime',
        theme: {
          title: 'Tema',
          subtitle: 'Promjenite temu računa',
        },
      },
      data: {
        title: 'Podatci',
        subtitle: 'Iskorišteno 14/15 GB',
        button: 'Promjenite plan pretplate',
      },
      export: {
        title: 'Eksport podataka',
        subtitle: 'Preuzimte sve svoje podatke u CSV formatu',
      },
      unarchived: {
        title: 'Unosi',
        subtitle: ['Ukupno dodano', 'unosa'],
      },
      archived: {
        title: 'Arhivi',
        subtitle: ['Arhivirano ukupno', 'unosa'],
      },
      entriesButton: 'Pregled svih unosa',
      types: {
        title: 'Polja za unos podataka',
        subtitle: ['Odabrano', 'polja za unos podataka'],
      },
      order: {
        title: 'Raspored polja za unos',
        subtitle: 'Promjenite raspored polja za unos',
      },
      typeButton: 'Dodajte forme',
      collections: {
        title: 'Dodane forme',
        subtitle: 'Popis kreiranih formi',
      },
      users: {
        title: 'Dodani korisnici',
        subtitle: 'Popis korisnika u vašem poduzeću',
        button: 'Dodajte korisnika',
      },
      support: {
        title: 'Podrška',
        subtitle: 'Kontaktirajte nas za pomoć pri korištenju aplikacije',
      },
      documentation: {
        title: 'Dokumentacija',
        subtitle: 'Pretražite dokumentaciju korištenja aplikacije',
      },
      feedback: {
        title: 'Povratna informacija',
        subtitle: 'Pošaljite nam povratnu informaciju',
      },
    },
  },
});

export default Strings;

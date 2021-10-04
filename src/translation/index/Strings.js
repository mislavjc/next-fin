import LocalizedStrings from 'react-localization';

const Strings = new LocalizedStrings({
  en: {
    hero: {
      title: 'Landing page is in the works',
      subtitle:
        'FIN is a platform that facilitates the recording of business processes, is easy to use and is available anytime and anywhere.',
      button: 'Start using',
    },
  },
  hr: {
    hero: {
      title: 'Landing page je u izradi',
      subtitle:
        'FIN je platforma koja olakšava evidenciju poslovnih procesa, jednostavna je za korištenje te je dostupna bilo kada i bilo gdje.',
      button: 'Započnite korištenje',
    },
  },
});

export default Strings;
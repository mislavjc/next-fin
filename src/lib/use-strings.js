import { useRouter } from 'next/router';

export const useStrings = (stringFile) => {
  const router = useRouter();

  try {
    stringFile.setLanguage(router.locale);
  } catch (e) {
    // due to JSX, but it still works.
    const msg = e.message ?? '';
    const known = msg.startsWith('Cannot assign to read only property');
    if (!known) {
      throw e;
    }
  }

  return stringFile;
};

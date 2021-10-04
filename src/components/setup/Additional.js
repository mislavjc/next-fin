import LocalizedStrings from 'react-localization';

import TextField from '@mui/material/TextField';

import { useStrings } from '@/lib/use-strings';

export const Additional = ({ category, value, onChange }) => {
  const { label } = useStrings(Strings);

  return (
    <TextField
      fullWidth
      variant="filled"
      type="text"
      id={`id${category}dropdown`}
      name="categoryNames"
      label={label}
      value={value ? value : ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const Strings = new LocalizedStrings({
  en: {
    label: 'Category for dropdown',
  },
  hr: {
    label: 'Kategorija za izbornik',
  },
});

import LocalizedStrings from 'react-localization';
import { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';

import { useStrings } from '@/lib/use-strings';

export const Field = ({ category, setNameObj, nameObj }) => {
  const [name, setName] = useState(nameObj[category] || '');

  const { label } = useStrings(Strings);

  useEffect(() => {
    nameObj[category] = name;
    setNameObj(nameObj);
  }, [name]);

  return (
    <TextField
      fullWidth
      variant="filled"
      type="text"
      id={`id${category}`}
      name={`name${category}`}
      label={label}
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
};

const Strings = new LocalizedStrings({
  en: {
    label: 'Category name',
  },
  hr: {
    label: 'Naziv kategorije',
  },
});

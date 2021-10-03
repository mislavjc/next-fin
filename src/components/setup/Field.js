import { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';

export const Field = ({ category, setNameObj, nameObj }) => {
  const [name, setName] = useState(nameObj[category] || '');

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
      label="Naziv kategorije"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
};

import { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

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
      name="categoryNames"
      label="Naziv kategorije"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
};

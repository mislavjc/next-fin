import { useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export const RelationTitle = ({ category, value, onChange, option }) => {
  const [autocompleteValue, setAutocompleteValue] = useState('');

  return (
    <Autocomplete
      options={option.titles}
      value={value ? value : ''}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={autocompleteValue}
      onInputChange={(event, newAutocompleteValue) => {
        setAutocompleteValue(newAutocompleteValue);
      }}
      isOptionEqualToValue={(_, __) => true}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="filled"
          id={`id${category}relationcategory`}
          label="Odaberite formu za povezivanje"
        />
      )}
    />
  );
};

export const RelationCategory = ({
  category,
  value,
  onChange,
  types,
  selectedTitle,
}) => {
  const [selectedTypes, setSelectedTypes] = useState(
    types.map((type) => type.name)
  );
  const [autocompleteValue, setAutocompleteValue] = useState('');

  useEffect(() => {
    setSelectedTypes(
      types.filter((t) => t.title === selectedTitle).map((type) => type.name)
    );
  }, [selectedTitle]);

  return (
    <Autocomplete
      options={selectedTypes}
      value={value ? value : ''}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={autocompleteValue}
      onInputChange={(event, newAutocompleteValue) => {
        setAutocompleteValue(newAutocompleteValue);
      }}
      isOptionEqualToValue={(_, __) => true}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="filled"
          id={`id${category}relationcategory`}
          label="Odaberite kategoriju za povezivanje"
        />
      )}
    />
  );
};

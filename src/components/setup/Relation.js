import LocalizedStrings from 'react-localization';
import { useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { useStrings } from '@/lib/use-strings';

export const RelationTitle = ({ category, value, onChange, option }) => {
  const [autocompleteValue, setAutocompleteValue] = useState('');

  const { titleLabel } = useStrings(Strings);

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
          label={titleLabel}
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

  const { categoryLabel } = useStrings(Strings);

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
          label={categoryLabel}
        />
      )}
    />
  );
};

const Strings = new LocalizedStrings({
  en: {
    titleLabel: 'Choose a collection to connect',
    categoryLabel: 'Choose a category to connect',
  },
  hr: {
    titleLabel: 'Odaberite formu za povezivanje',
    categoryLabel: 'Odaberite kategoriju za povezivanje',
  },
});

import LocalizedStrings from 'react-localization';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { useStrings } from '@/lib/use-strings';

export const CollectionSelect = ({ option, value, onChange }) => {
  const { collectionSelection } = useStrings(Strings);

  return (
    <FormControl variant="filled" fullWidth style={{ marginBottom: '2rem' }}>
      <InputLabel id={'selectedTitle'}>{collectionSelection}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        labelId={'selectedTitleSelect'}
        id={'selectedTitleSelectID'}
      >
        {option.titles.map((title) => (
          <MenuItem value={title} key={title}>
            {title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const Strings = new LocalizedStrings({
  en: {
    collectionSelection: 'Collection selection',
  },
  hr: {
    collectionSelection: 'Izbor kolekcije',
  },
});

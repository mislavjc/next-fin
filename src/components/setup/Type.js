import LocalizedStrings from 'react-localization';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useStrings } from '@/lib/use-strings';

export const Type = ({ category, value, onChange, hasMoreForms }) => {
  const {
    type,
    text,
    date,
    number,
    dropdown,
    currency,
    textarea,
    uuid,
    relation,
  } = useStrings(Strings);

  return (
    <FormControl variant="filled" className="type">
      <InputLabel id={`labelid${category}`}>{type}</InputLabel>
      <Select
        value={value ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        labelId={`labelid${category}`}
        id={`id${category}`}
      >
        <MenuItem value={'text'}>{text}</MenuItem>
        <MenuItem value={'date'}>{date}</MenuItem>
        <MenuItem value={'number'}>{number}</MenuItem>
        <MenuItem value={'dropdown'}>{dropdown}</MenuItem>
        <MenuItem value={'currency'}>{currency}</MenuItem>
        <MenuItem value={'textarea'}>{textarea}</MenuItem>
        <MenuItem value={'uuid'}>{uuid}</MenuItem>
        {hasMoreForms && <MenuItem value={'relation'}>{relation}</MenuItem>}
      </Select>
    </FormControl>
  );
};

const Strings = new LocalizedStrings({
  en: {
    type: 'Type',
    text: 'Text',
    date: 'Date',
    number: 'Number',
    dropdown: 'Dropdown',
    currency: 'Currency',
    textarea: 'Text area',
    uuid: 'Unique identifier',
    relation: 'Related collection',
  },
  hr: {
    type: 'Tip',
    text: 'Tekst',
    date: 'Datum',
    number: 'Broj',
    dropdown: 'Izbornik',
    currency: 'Iznos',
    textarea: 'Blok teksta',
    uuid: 'Jedinstveni identifikator',
    relation: 'Poveznica',
  },
});

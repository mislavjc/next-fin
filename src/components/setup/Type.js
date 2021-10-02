import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const Type = ({ category, value, onChange, hasMoreForms }) => {
  return (
    <FormControl variant="filled" className="type">
      <InputLabel id={`labelid${category}`}>Tip</InputLabel>
      <Select
        value={value ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        labelId={`labelid${category}`}
        id={`id${category}`}
      >
        <MenuItem value={'text'}>Tekst</MenuItem>
        <MenuItem value={'date'}>Datum</MenuItem>
        <MenuItem value={'number'}>Broj</MenuItem>
        <MenuItem value={'dropdown'}>Izbornik</MenuItem>
        <MenuItem value={'currency'}>Iznos</MenuItem>
        <MenuItem value={'textarea'}>Blok teksta</MenuItem>
        <MenuItem value={'uuid'}>Jedinstveni identifikator</MenuItem>
        {hasMoreForms && <MenuItem value={'relation'}>Poveznica</MenuItem>}
      </Select>
    </FormControl>
  );
};

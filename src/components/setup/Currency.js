import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const Currency = ({ category, value, onChange }) => {
  return (
    <FormControl variant="filled" className="currency">
      <InputLabel id={`labelid${category}currency`}>Valuta</InputLabel>
      <Select
        value={value ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        labelId={`labelid${category}currency`}
        id={`id${category}currency`}
      >
        <MenuItem value={'HRK'} selected>
          HRK
        </MenuItem>
        <MenuItem value={'$'}>$</MenuItem>
        <MenuItem value={'€'}>€</MenuItem>
        <MenuItem value={'£'}>£</MenuItem>
      </Select>
    </FormControl>
  );
};

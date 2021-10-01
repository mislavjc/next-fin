import TextField from '@mui/material/TextField';

export const Additional = ({ category, value, onChange }) => {
  return (
    <TextField
      fullWidth
      variant="filled"
      type="text"
      id={`id${category}dropdown`}
      name="categoryNames"
      label="Kategorija za izbornik"
      value={value ? value : ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

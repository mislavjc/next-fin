import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export const Currency = ({ category, value, onChange }) => {
  return (
    <FormControl
      variant="filled"
      className="currency"
    >
      <InputLabel id={`labelid${category}currency`}>Valuta</InputLabel>
      <Select
        value={value ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        labelId={`labelid${category}currency`}
        id={`id${category}currency`}
      >
        <MenuItem value={"HRK"} selected>HRK</MenuItem>
        <MenuItem value={"$"}>$</MenuItem>
        <MenuItem value={"€"}>€</MenuItem>
        <MenuItem value={"£"}>£</MenuItem>
      </Select>
    </FormControl>
  );
};

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export const Type = ({ category, value, onChange }) => {
  return (
    <FormControl variant="filled" className="type">
      <InputLabel id={`labelid${category}`}>Tip</InputLabel>
      <Select
        value={value ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        labelId={`labelid${category}`}
        id={`id${category}`}
      >
        <MenuItem value={"text"}>Tekst</MenuItem>
        <MenuItem value={"date"}>Datum</MenuItem>
        <MenuItem value={"number"}>Broj</MenuItem>
        <MenuItem value={"dropdown"}>Izbornik</MenuItem>
        <MenuItem value={"currency"}>Iznos</MenuItem>
        <MenuItem value={"textarea"}>Blok teksta</MenuItem>
      </Select>
    </FormControl>
  );
};

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export const Dropdown = ({ category, value, onChange }) => {
  return (
    <FormControl
      variant="filled"
      style={{ minWidth: "10rem", marginLeft: "1rem" }}
    >
      <InputLabel id={`labelid`}>Tip</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        labelId={`labelid${category}`}
        id={`id${category}`}
      >
        <MenuItem value={"text"}>Tekst</MenuItem>
        <MenuItem value={"date"}>Datum</MenuItem>
        <MenuItem value={"number"}>Broj</MenuItem>
        <MenuItem value={"dropdown"}>Izbornik</MenuItem>
        <MenuItem value={"decimal"}>Decimalni broj</MenuItem>
        <MenuItem value={"tracking"}>Tracking broj</MenuItem>
      </Select>
    </FormControl>
  );
};

import { useState, useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export const Type = ({ category, setTypeObj, typeObj }) => {
  const [type, setType] = useState("");

  useEffect(() => {
    typeObj[category] = type;
    setTypeObj(typeObj);
  }, [type]);

  return (
    <FormControl variant="filled">
      <InputLabel id={`labelid${category}`}>Tip</InputLabel>
      <Select
        value={type}
        onChange={(e) => setType(e.target.value)}
        labelId={`labelid${category}`}
        id={`id${category}`}
      >
        <MenuItem value={"Tekst"}>Tekst</MenuItem>
        <MenuItem value={"Datum"}>Datum</MenuItem>
        <MenuItem value={"Broj"}>Broj</MenuItem>
        <MenuItem value={"Decimalni broj"}>Decimalni broj</MenuItem>
        <MenuItem value={"Tracking broj"}>Tracking broj</MenuItem>
      </Select>
    </FormControl>
  );
};

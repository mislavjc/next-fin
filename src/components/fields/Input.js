import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useState, useEffect } from "react";

export const Input = ({
  name,
  type,
  id,
  dataObj,
  setDataObj,
  initialValue,
  additional,
}) => {
  let valueId = id;
  const inputValue = () => {
    if (initialValue) {
      for (let value of initialValue.inputs) {
        if (value.type._id === id) {
          valueId = value._id;
          return value.value;
        }
      }
    }
    return "";
  };
  const [value, setValue] = useState(inputValue());

  useEffect(() => {
    dataObj[valueId] = value;
    setDataObj(dataObj);
  }, [value]);
  if (type === "dropdown") {
    return (
      <FormControl variant="filled" fullWidth>
        <InputLabel id={`labelid${id}`}>{name}</InputLabel>
        <Select
          value={value ? value : ""}
          onChange={(e) => setValue(e.target.value)}
          labelId={`labelid${id}`}
          id={`id${id}`}
        >
          {additional.map((additional) => (
            <MenuItem value={additional} key={additional}>
              {additional}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
  if (type === "date") {
    return (
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        variant="filled"
        type={type}
        id={name}
        name={name}
        label={name}
        InputLabelProps={{
          shrink: true,
        }}
      />
    );
  }
  if (type === "textarea") {
    return (
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        variant="filled"
        type={type}
        id={name}
        name={name}
        label={name}
        multiline
        rows={4}
      />
    );
  }
  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      fullWidth
      variant="filled"
      type={type}
      id={name}
      name={name}
      label={name}
    />
  );
};

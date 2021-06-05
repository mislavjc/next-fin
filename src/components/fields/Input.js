import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useState, useEffect } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";

export const Input = ({
  name,
  type,
  id,
  dataObj,
  setDataObj,
  initialValue,
  additional,
  currency,
  required,
  isSubmitted,
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
  const [error, setError] = useState(false);
  const errorMessage = "Polje ne smije biti prazno.";

  useEffect(() => {
    if (isSubmitted && value === "" && required) {
      setError(true);
    } else {
      setError(false);
    }
    dataObj[valueId] = value;
    setDataObj(dataObj);
  }, [value, isSubmitted]);
  if (type === "dropdown") {
    return (
      <FormControl variant="filled" fullWidth error={error}>
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
        error={error}
        helperText={error ? errorMessage : null}
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
        error={error}
        helperText={error ? errorMessage : null}
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
  if (type === "currency") {
    return (
      <TextField
        error={error}
        helperText={error ? errorMessage : null}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        variant="filled"
        type={type}
        id={name}
        name={name}
        label={name}
        InputProps={
          currency !== "£"
            ? {
                endAdornment: (
                  <InputAdornment position="end">{currency}</InputAdornment>
                ),
              }
            : {
                startAdornment: (
                  <InputAdornment position="start">{currency}</InputAdornment>
                ),
              }
        }
      />
    );
  }
  return (
    <TextField
      error={error}
      helperText={error ? errorMessage : null}
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

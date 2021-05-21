import TextField from "@material-ui/core/TextField";
import { useState, useEffect } from "react";

export const Input = ({
  name,
  type,
  id,
  dataObj,
  setDataObj,
  initialValue,
}) => {
  let valueId = id;
  const inputValue = () => {
    if (initialValue) {
      for (let value of initialValue.inputs) {
        if (value.type._id === id) {
          valueId = value._id
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
      id="numOfCategories"
      name={name}
      label={name}
    />
  );
};

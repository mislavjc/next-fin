import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export const Additional = ({ category, setAdditionalObj, additionalObj }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    additionalObj[category] = name;
    setAdditionalObj(additionalObj);
  }, [name]);

  return (
    <TextField
      fullWidth
      variant="filled"
      type="text"
      id={`id${category}`}
      name="categoryNames"
      label="Kategorije za izbornik"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
};

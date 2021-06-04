import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export const Additional = ({ category, value, onChange }) => {
  return (
    <TextField
      fullWidth
      variant="filled"
      type="text"
      id={`id${category}`}
      name="categoryNames"
      label="Kategorije za izbornik"
      value={value ? value : ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

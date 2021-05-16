import {useState} from 'react'
import TextField from "@material-ui/core/TextField";


export const Field = ({category, passChildData}) => {
  const [name, setName] = useState("");


  return (
    <TextField
      fullWidth
      variant="filled"
      type="text"
      id={category}
      name="categoryNames"
      label="Naziv kategorije"
      value={name}
      onChange={e => setName(e.target.value)}
    />
  );
};

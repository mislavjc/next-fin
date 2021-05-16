import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useState } from "react";

const validationSchema = yup.object({
  numOfCategories: yup
    .string("Unesite broj kategorija")
    .required("Potrebno je unijeti broj kategorija"),
});

export const BasicOptions = () => {
  const [count, setCount] = useState(0);

  const formik = useFormik({
    initialValues: {
      numOfCategories: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setCount(values.numOfCategories);
      axios
        .post("/api/basic-options", values)
        .then((response) => console.log(response));
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          variant="filled"
          type="number"
          id="numOfCategories"
          name="numOfCategories"
          label="Broj kategorija"
          value={formik.values.numOfCategories}
          onChange={formik.handleChange}
          error={
            formik.touched.numOfCategories &&
            Boolean(formik.errors.numOfCategories)
          }
          helperText={
            formik.touched.numOfCategories && formik.errors.numOfCategories
          }
        />
        <Button
          color="primary"
          variant="contained"
          type="submit"
          disableElevation
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

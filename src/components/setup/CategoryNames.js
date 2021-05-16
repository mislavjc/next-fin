import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useState } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { motion } from "framer-motion";
import { Field } from "../Field";

export const CategoryNames = ({ count }) => {
  const categoryArr = [];
  for (let i = 0; i < count; i++) {
    categoryArr.push(i);
  }

  return (
    <form>
      <motion.div
        initial={{ y: 50 }}
        animate={{
          y: 0,
        }}
      >
        {categoryArr.map((category) => (
          <div style={{ marginTop: "1rem" }} key={category}>
            <Typography variant="h6">Kategorija {category + 1}</Typography>
            <Field category={category} />
            {/* <FormControl variant="filled">
              <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl> */}
          </div>
        ))}
        <Button
          style={{ marginTop: "1rem" }}
          color="primary"
          variant="contained"
          type="submit"
          disableElevation
        >
          Submit
        </Button>
      </motion.div>
    </form>
  );
};

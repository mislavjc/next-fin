import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { Field } from "./Field";
import { Type } from "./Type";
import { useSession } from "next-auth/client";


export const CategoryNames = ({ count }) => {
  const [session, loading] = useSession();
  const [nameObj, setNameObj] = useState({});
  const [typeObj, setTypeObj] = useState({});

  const clickHandler = (e) => {
    const currentUser = session.user;
    e.preventDefault();
    const values = {
      currentUser,
      names: nameObj,
      types: typeObj,
    };
    axios
      .post("/api/basic-options", values)
      .then((response) => console.log(response));
  };

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
            <Field
              category={category}
              setNameObj={setNameObj}
              nameObj={nameObj}
            />
            <Type
              category={category}
              setTypeObj={setTypeObj}
              typeObj={typeObj}
            />
          </div>
        ))}
        <Button
          style={{ marginTop: "1rem" }}
          color="primary"
          variant="contained"
          type="submit"
          onClick={clickHandler}
          disableElevation
        >
          Submit
        </Button>
      </motion.div>
    </form>
  );
};

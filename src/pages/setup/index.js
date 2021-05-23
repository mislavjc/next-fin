import Grid from "@material-ui/core/Grid";
import { getSession } from "next-auth/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Field } from "@/components/setup/Field";
import { Type } from "@/components/setup/Type";
import { motion, AnimateSharedLayout } from "framer-motion";
import axios from "axios";
import Container from "@material-ui/core/Container";
import { ButtonGroup } from "@material-ui/core";

const containerVariants = {
  hidden: {
    y: 50,
  },
  visible: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      delayChildren: 0.5,
    },
  },
};

const inputVariants = {
  hidden: {
    y: 50,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      stiffness: 100,
    },
  },
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
export default function Setup({ session }) {
  useEffect(() => {
    if (!session) {
      router.push("/api/auth/signin");
    }
  }, [session]);

  const [count, setCount] = useState(0);
  const router = useRouter();
  const [nameObj, setNameObj] = useState({});
  const [typeObj, setTypeObj] = useState({});
  const [arr, setArr] = useState([]);

  const removeHandler = (index) => {
    delete nameObj[index];
    delete typeObj[index];
    setCount(count - 1);
  };

  const clickHandler = (e) => {
    const currentUser = session.user;
    e.preventDefault();
    const values = {
      currentUser,
      names: nameObj,
      types: typeObj,
    };
    axios.post("/api/basic-options", values).then(router.push("/form"));
  };
  const categoryArr = [-1];
  useEffect(() => {
    if (count < 5) {
      for (let i = 0; i < count; i++) {
        categoryArr.push(i);
      }
      setArr(categoryArr);
    }
  }, [count]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Container maxWidth="sm">
        <Grid item xs={12}>
          <form>
            <div>
              <AnimateSharedLayout>
                {arr.map((category, index) => (
                  <motion.div
                    variants={inputVariants}
                    style={{ marginTop: "1rem" }}
                    key={category}
                    layoutId={index}
                  >
                    <Typography variant="h6">
                      Kategorija {category + 2}
                    </Typography>
                    <div style={{ display: "flex" }}>
                      <Field
                        category={index}
                        setNameObj={setNameObj}
                        nameObj={nameObj}
                      />
                      <Type
                        category={index}
                        setTypeObj={setTypeObj}
                        typeObj={typeObj}
                      />
                    </div>
                    {index === arr.length - 1 && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <ButtonGroup color="primary" variant="outlined">
                          {count < 4 && (
                            <Button onClick={() => setCount(count + 1)}>
                              +
                            </Button>
                          )}
                          <Button onClick={() => removeHandler(index)}>
                            -
                          </Button>
                        </ButtonGroup>
                      </div>
                    )}
                  </motion.div>
                ))}
                <motion.div layoutId={21}>
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
              </AnimateSharedLayout>
            </div>
          </form>
        </Grid>
      </Container>
    </motion.div>
  );
}

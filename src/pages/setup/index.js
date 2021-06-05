import Grid from "@material-ui/core/Grid";
import { getSession } from "next-auth/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Field } from "@/components/setup/Field";
import { Type } from "@/components/setup/Type";
import { Additional } from "@/components/setup/Additional";
import { motion, AnimateSharedLayout } from "framer-motion";
import axios from "axios";
import Container from "@material-ui/core/Container";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Chip from "@material-ui/core/Chip";

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
  if (!session) {
    context.res.writeHead(302, { Location: "/api/auth/signin" });
    context.res.end();
    return {
      props: {
        session: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
export default function Setup({ session }) {
  const [count, setCount] = useState(0);
  const router = useRouter();
  const [nameObj, setNameObj] = useState({});
  const [typeObj, setTypeObj] = useState({});
  const [additionalObj, setAdditionalObj] = useState({});
  const [arr, setArr] = useState([]);
  const [additionalArr, setAdditionalArr] = useState({});

  const removeHandler = (index) => {
    delete nameObj[index];
    delete typeObj[index];
    delete additionalObj[index];
    delete additionalArr[index];
    setCount(count - 1);
  };

  const additionalHandler = (index) => {
    if (!additionalArr[index]) {
      additionalArr[index] = [additionalObj[index]];
      setAdditionalArr(additionalArr);
    } else {
      additionalArr[index].push(additionalObj[index]);
      setAdditionalArr(additionalArr);
      console.log(additionalArr);
    }
    setAdditionalObj({ ...additionalObj, [index]: "" });
  };

  const chipHandler = (index, i) => {
    additionalArr[index].splice(i, 1);
    setAdditionalArr(additionalArr);
  };

  const clickHandler = (e) => {
    const currentUser = session.user;
    e.preventDefault();
    const values = {
      currentUser,
      names: nameObj,
      types: typeObj,
      additional: additionalArr,
    };
    axios.post("/api/basic-options", values).then(router.push("/all-items"));
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
                    <div className="setup-fields">
                      <Field
                        category={index}
                        setNameObj={setNameObj}
                        nameObj={nameObj}
                      />
                      <Type
                        category={index}
                        value={typeObj[index]}
                        onChange={(val) => {
                          setTypeObj({
                            ...typeObj,
                            [index]: val,
                          });
                        }}
                      />
                    </div>
                    {typeObj[index] == "dropdown" && (
                      <motion.div
                        style={{ marginTop: "1rem", marginLeft: "0" }}
                        variants={inputVariants}
                      >
                        <div style={{ display: "flex", marginBottom: "1rem" }}>
                          <Additional
                            category={index}
                            value={additionalObj[index]}
                            onChange={(val) => {
                              setAdditionalObj({
                                ...additionalObj,
                                [index]: val,
                              });
                            }}
                          />
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => additionalHandler(index)}
                          >
                            Dodaj kategoriju
                          </Button>
                        </div>
                        {additionalArr[index] &&
                          additionalArr[index].map((additional, i) => (
                            <motion.span
                              variants={inputVariants}
                              key={additional}
                            >
                              <Chip
                                color="primary"
                                variant="outlined"
                                label={additional}
                                onDelete={() => chipHandler(index, i)}
                              />
                            </motion.span>
                          ))}
                      </motion.div>
                    )}
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
                    Spremi
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

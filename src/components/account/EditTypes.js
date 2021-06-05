import { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import { motion, AnimateSharedLayout } from "framer-motion";
import { Field } from "@/components/setup/Field";
import { Type } from "@/components/setup/Type";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { Additional } from "@/components/setup/Additional";
import Chip from "@material-ui/core/Chip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Currency } from "@/components/setup/Currency";

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

export const EditTypes = ({
  setShowEditCategories,
  setOpen,
  user,
  owner,
  typeCount,
  typeNames,
  typeTypes,
  typeRequired,
  typeCurrency,
  typeAdditional,
  typeIdArr,
  setMessage,
}) => {
  const [nameObj, setNameObj] = useState(typeNames);
  const [typeObj, setTypeObj] = useState(typeTypes);
  const [requiredObj, setRequiredObj] = useState(typeRequired);
  const [additionalObj, setAdditionalObj] = useState({});
  const [currencyObj, setCurrencyObj] = useState(typeCurrency);
  const [count, setCount] = useState(typeCount);
  const [arr, setArr] = useState([]);
  const [additionalArr, setAdditionalArr] = useState(typeAdditional || {});

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

  const submitHandler = () => {
    const values = {
      owner,
      names: nameObj,
      types: typeObj,
      required: requiredObj,
      currency: currencyObj,
      additional: additionalArr,
      typeIdArr,
      count,
    };
    axios
      .post("/api/account/update-types", values)
      .then(
        setShowEditCategories(false),
        setOpen(true),
        setMessage("Uspješno promjenjene postavke.")
      );
  };

  const categoryArr = [];
  useEffect(() => {
    if (count < 20) {
      for (let i = 0; i < count; i++) {
        categoryArr.push(i);
      }
      setArr(categoryArr);
    }
  }, [count]);

  return (
    <Paper>
      <List>
        <div style={{ display: "flex", padding: "1rem" }}>
          <Typography variant="h5">
            {user ? "Promjena postavki" : "Unos novog računa"}
          </Typography>
          <Tooltip title="Zatvori">
            <IconButton
              style={{
                position: "relative",
                top: "-8px",
                marginLeft: "auto",
              }}
              onClick={() => setShowEditCategories(false)}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Divider variant="middle" />
        <div className="overscroll">
          <AnimateSharedLayout>
            {arr.map((category, index) => (
              <div className="list-form" key={category}>
                <motion.div
                  variants={inputVariants}
                  style={{ marginTop: "1rem" }}
                  layoutId={index}
                >
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
                    {typeObj[index] === "currency" && (
                      <motion.div variants={inputVariants}>
                        <Currency
                          value={currencyObj[index]}
                          onChange={(val) => {
                            setCurrencyObj({ ...currencyObj, [index]: val });
                          }}
                        />
                      </motion.div>
                    )}
                    <FormControlLabel
                      value="top"
                      control={
                        <Switch
                          checked={requiredObj[index] === true}
                          color="primary"
                          onChange={() =>
                            setRequiredObj({
                              ...requiredObj,
                              [index]: !requiredObj[index],
                            })
                          }
                        />
                      }
                      label="Obavezno"
                      labelPlacement="top"
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
                          style={{ marginLeft: "1rem" }}
                          onClick={() => additionalHandler(index)}
                        >
                          Dodaj
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
                        {count < 20 && (
                          <Button onClick={() => setCount(count + 1)}>+</Button>
                        )}
                      </ButtonGroup>
                    </div>
                  )}
                  {index !== arr.length - 1 && (
                    <Divider style={{ marginTop: "1rem" }} />
                  )}
                </motion.div>
              </div>
            ))}
          </AnimateSharedLayout>
        </div>
      </List>
      <Divider />
      <List>
        <ListItem onClick={submitHandler} button>
          <ListItemText primary="Spremite promjene" />
        </ListItem>
      </List>
    </Paper>
  );
};

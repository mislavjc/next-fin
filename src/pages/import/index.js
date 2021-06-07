import Grid from "@material-ui/core/Grid";
import { dbConnect } from "@/middleware/db";
import { getSession } from "next-auth/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Field } from "@/components/setup/Field";
import { Type } from "@/components/setup/Type";
import { Additional } from "@/components/setup/Additional";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";
import axios from "axios";
import Container from "@material-ui/core/Container";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import ArchiveIcon from "@material-ui/icons/Archive";
import UnarchiveIcon from "@material-ui/icons/Unarchive";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Backdrop from "@material-ui/core/Backdrop";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Currency } from "@/components/setup/Currency";
import CSVReader from "react-csv-reader";
import Snackbar from "@material-ui/core/Snackbar";

const form = [
  {
    name: "Datum",
    value: "5/6/2021",
    type: "number",
  },
  {
    name: "Špediter",
    value: "DPD",
    type: "text",
  },
  {
    name: "Cijena",
    value: "100kn",
    type: "text",
  },
];

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
  exit: {
    y: 50,
  },
};

const formVariants = {
  hidden: {
    y: -1000,
  },
  visible: {
    y: 0,
  },
  exit: {
    y: -1000,
    opacity: 0,
  },
};

const inputVariants = {
  hidden: {
    y: 50,
    opacity: 0,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.01,
    },
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
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

export default function Home({ session }) {
  const router = useRouter();
  const [imported, setImported] = useState([]);
  const [importedValues, setImportedValues] = useState({});
  const [headers, setHeaders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [nameObj, setNameObj] = useState({});
  const [typeObj, setTypeObj] = useState({});
  const [requiredObj, setRequiredObj] = useState({});
  const [additionalObj, setAdditionalObj] = useState({});
  const [currencyObj, setCurrencyObj] = useState({});
  const [additionalArr, setAdditionalArr] = useState({});
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    if (imported.length > 0) {
      for (let i = 0; i < imported.length; i++) {
        if (!i) {
          headers.push(...imported[i]);
        } else {
          for (let j = 0; j < imported[i].length; j++) {
            if (imported[i].length === headers.length) {
              if (!importedValues[headers[j]]) {
                importedValues[headers[j]] = [imported[i][j]];
              } else {
                importedValues[headers[j]].push(imported[i][j]);
              }
            } else {
              setError(true);
              break;
            }
          }
        }
      }
      if (!error) {
        for (let i = 0; i < headers.length; i++) {
          nameObj[i] = headers[i];
          typeObj[i] = "text";
        }
        setImportedValues(importedValues);
        setShowForm(true);
        setNameObj(nameObj);
        setHeaders(headers);
      } else {
        setImportedValues({});
        setHeaders([]);
        setMessage("Neispravan format tablice");
        setOpen(true);
      }
    }
  }, [imported]);

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
      required: requiredObj,
      currency: currencyObj,
      importedValues,
    };
    axios.post("/api/import", values).then(router.push("/all-items"));
    console.log(values);
  };

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div style={{ padding: "2rem 0" }}>
      <div className="landing-text">
        <Typography
          color="primary"
          variant="h2"
          component="h1"
          align="center"
          fontWeight={600}
        >
          Prenesite svoje Excel tablice
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          color="textPrimary"
        >
          Imate unose već spremljene u Excel tablici? Jednostavno je priložite
          ispod!
        </Typography>
      </div>
      <div className="wrapper">
        <Button
          variant="outlined"
          color="primary"
          htmlFor="react-csv-reader-input"
        >
          <span style={{ position: "absolute" }}>
            Priložite <br /> Excel datoteke
          </span>
          <CSVReader
            cssClass="react-csv-input"
            onFileLoaded={(data) => setImported(data)}
          />
        </Button>
      </div>
      <Container maxWidth="sm" style={{ marginTop: "1rem" }}>
        {showForm && (
          <Grid item xs={12}>
            <form>
              <AnimateSharedLayout>
                <Paper variant="outlined" style={{ padding: "1rem" }}>
                  <Typography variant="h5">Odabir polja za unos</Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Prema odabranim kategorijama napraviti će se ekranski
                    pregled polja za unos (kategorija).
                  </Typography>
                  <Typography
                    className="card"
                    variant="button"
                    color="textSecondary"
                    onClick={() => setShowExample(true)}
                    gutterBottom
                  >
                    Primjer
                    <HelpOutlineIcon fontSize="inherit" />
                  </Typography>
                  <motion.div
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {headers.map((header, index) => (
                      <motion.div
                        style={{ marginTop: "1rem" }}
                        variansts={inputVariants}
                        custom={index}
                        key={index}
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
                                  setCurrencyObj({
                                    ...currencyObj,
                                    [index]: val,
                                  });
                                }}
                              />
                            </motion.div>
                          )}
                          <FormControlLabel
                            value="top"
                            className="required-switch"
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
                            <div
                              style={{ display: "flex", marginBottom: "1rem" }}
                            >
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
                        {index !== headers.length - 1 && (
                          <Divider style={{ marginTop: "1rem" }} />
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
                  </motion.div>
                </Paper>
              </AnimateSharedLayout>
            </form>
          </Grid>
        )}
        <AnimatePresence>
          {showExample && (
            <motion.div
              className="fab-form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Paper style={{ padding: "1rem" }} className="overscroll">
                <div style={{ display: "flex" }}>
                  <Typography variant="h5">Primjer polja</Typography>
                  <Tooltip title="Zatvori">
                    <IconButton
                      style={{
                        position: "relative",
                        top: "-8px",
                        marginLeft: "auto",
                      }}
                      onClick={() => setShowExample(false)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </div>
                {form.map((input) => (
                  <TextField
                    key={input.name}
                    style={{ marginBottom: "1rem" }}
                    fullWidth
                    variant="filled"
                    type={input.type}
                    id={input.name}
                    label={input.name}
                  />
                ))}
                <Divider variant="middle" style={{ margin: "1rem 0" }} />
                <Typography variant="h5" gutterBottom>
                  Primjer kreiranog unosa iz polja
                </Typography>
                <Paper>
                  <List>
                    {form.map((input, index) => (
                      <span key={index}>
                        <ListItem button className="card">
                          <span
                            style={{
                              overflowWrap: "break-word",
                              width: "25%",
                            }}
                          >
                            <Typography variant="overline">
                              {input.name}
                            </Typography>
                          </span>
                          <Divider orientation="vertical" flexItem />
                          <Typography
                            variant="body1"
                            style={{
                              overflowWrap: "break-word",
                              width: "75%",
                              paddingLeft: "0.5rem",
                            }}
                          >
                            {input.value}
                          </Typography>
                        </ListItem>
                        <Divider />
                      </span>
                    ))}
                    <ListItem>
                      <Tooltip title="Nazad">
                        <IconButton onClick={() => setShowExample(false)}>
                          <KeyboardBackspaceIcon />
                        </IconButton>
                      </Tooltip>
                      <span style={{ marginLeft: "auto" }}>
                        <Tooltip title="Promjeni">
                          <IconButton style={{ zIndex: 7 }} className="edit">
                            <EditIcon className="edit" />
                          </IconButton>
                        </Tooltip>
                        <>
                          {form.archived ? (
                            <Tooltip title="Vrati iz arhiva">
                              <IconButton>
                                <UnarchiveIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Arhiviraj">
                              <IconButton>
                                <ArchiveIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Obriši">
                            <IconButton>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      </span>
                    </ListItem>
                  </List>
                </Paper>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
        <Backdrop style={{ color: "#fff", zIndex: 9 }} open={showExample} />
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
}

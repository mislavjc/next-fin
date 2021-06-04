import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { dbConnect } from "@/middleware/db";
import Form from "@/models/form";
import User from "@/models/user";
import Type from "@/models/type";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { CardItem } from "@/components/CardItem";
import { Input } from "@/components/fields/Input";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import { Toolbar } from "@/components/Toolbar";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: -50,
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

export async function getServerSideProps(context) {
  dbConnect();
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: "/api/auth/signin" });
    context.res.end();
    return {
      props: {
        owner: false,
        forms: false,
      },
    };
  }
  const { user } = session;
  const owner = await User.findOne({ email: user.email });
  const types = await Type.find({ option: owner.option });
  const forms = await Form.find({
    option: owner.option,
    archived: true,
  }).populate({
    path: "inputs",
    populate: {
      path: "type",
    },
  });
  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
      types: JSON.parse(JSON.stringify(types)),
      forms: JSON.parse(JSON.stringify(forms)),
    },
  };
}

export default function allItems({ owner, types, forms }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [dataObj, setDataObj] = useState({});
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState({});
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(forms);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (search !== "") {
      axios.get(`/api/search/${search}`).then((res) => setEntries(res.data));
    } else {
      setEntries(forms);
    }
  }, [search, forms]);

  const openFormHandler = () => {
    if (owner.create) {
      setShowForm(true);
    } else {
      setMessage("Nemate prava za dodavanje unosa!");
      setOpen(true);
    }
  };

  const clickHandler = () => {
    setShowForm(false);
    if (owner.create) {
      const currentUser = owner._id;
      const values = {
        currentUser,
        dataObj,
      };
      axios
        .post("/api/crud/create", values)
        .then(router.push("/all-items"))
        .then(setMessage("Dodan unos!"), setOpen(true));
    } else {
      setMessage("Nemate prava za dodavanje unosa!");
      setOpen(true);
    }
  };

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center">
          Unosi
        </Typography>
        <Toolbar search={search} setSearch={setSearch} />
        {!forms.length && !showForm && (
          <div
            style={{
              height: "80vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h2">Dodajte unos pritiskom na plus</Typography>
          </div>
        )}
        <Grid container spacing={4}>
          <AnimateSharedLayout>
            <AnimatePresence>
              {entries.map((form, index) => (
                <Grid item xs={12} md={6} lg={4} key={form._id}>
                  {showMore[form._id] ? (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={index}
                      layoutId={form._id}
                      className="fab-form"
                    >
                      <CardItem
                        form={form}
                        types={types}
                        owner={owner}
                        onClose={() => {
                          setShowMore({ ...showMore, [form._id]: false });
                        }}
                        showBack={showMore[form._id]}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={index}
                      layoutId={form._id}
                      style={{ zIndex: 9 }}
                    >
                      <CardItem
                        form={form}
                        types={types}
                        owner={owner}
                        onOpen={() =>
                          setShowMore({ ...showMore, [form._id]: true })
                        }
                      />
                    </motion.div>
                  )}
                  <Backdrop
                    style={{ color: "#fff", zIndex: 8 }}
                    open={showMore[form._id] === true}
                  />
                </Grid>
              ))}
            </AnimatePresence>
          </AnimateSharedLayout>
        </Grid>
        {!showForm && (
          <Fab
            onClick={openFormHandler}
            color="secondary"
            aria-label="add"
            style={{ position: "fixed", right: "1rem", bottom: "1rem" }}
          >
            <AddIcon />
          </Fab>
        )}
      </Container>
      <AnimatePresence>
        {showForm && (
          <motion.div
            variants={formVariants}
            className="fab-form"
            initial="hidden"
            animate="visible"
            exit="exit"
            layoutId={"form-fab"}
          >
            <Paper style={{ padding: "1rem" }}>
              <div style={{ display: "flex" }}>
                <Typography variant="h5">Novi unos</Typography>
                <Tooltip title="Zatvori">
                  <IconButton
                    style={{
                      position: "relative",
                      top: "-8px",
                      marginLeft: "auto",
                    }}
                    onClick={() => setShowForm(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </div>
              {types.map((type) => (
                <div style={{ marginBottom: "1rem" }} key={type._id}>
                  <Input
                    name={type.name}
                    type={type.type}
                    id={type._id}
                    dataObj={dataObj}
                    setDataObj={setDataObj}
                    additional={type.additional || null}
                  />
                </div>
              ))}
              <Button
                onClick={clickHandler}
                variant="contained"
                size="large"
                color="primary"
              >
                Spremi
              </Button>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      <Backdrop style={{ color: "#fff", zIndex: 9 }} open={showForm} />
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

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
import SaveIcon from "@material-ui/icons/Save";
import { useState } from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";

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
  const types = await Type.find({ owner: owner._id });
  const forms = await Form.find({ owner: owner._id, archived: false }).populate(
    {
      path: "inputs",
      populate: {
        path: "type",
      },
    }
  );
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

  const clickHandler = () => {
    setShowForm(false);
    const currentUser = owner._id;
    const values = {
      currentUser,
      dataObj,
    };
    axios.post("/api/crud/create", values).then(router.push("/all-items"));
  };

  return (
    <div style={{ position: "relative" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center">
          Unosi
        </Typography>
        <Grid container spacing={4}>
          <AnimateSharedLayout>
            <AnimatePresence>
              {forms.map((form, index) => (
                <Grid item xs={12} md={6} lg={4} key={form._id}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={index}
                    layoutId={form._id}
                  >
                    <CardItem form={form} />
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </AnimateSharedLayout>
        </Grid>
        {!showForm && (
          <Fab
            onClick={() => setShowForm(true)}
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
              <Tooltip title="Zatvori">
                <IconButton onClick={() => setShowForm(false)}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Spremi">
                <IconButton onClick={clickHandler} style={{ float: "right" }}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

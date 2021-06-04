import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import Link from "next/link";
import { dbConnect } from "@/middleware/db";
import Form from "@/models/form";
import User from "@/models/user";
import Type from "@/models/type";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import DataUsageIcon from "@material-ui/icons/DataUsage";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import StorageIcon from "@material-ui/icons/Storage";
import ArchiveIcon from "@material-ui/icons/Archive";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import SearchIcon from "@material-ui/icons/Search";
import FeedbackIcon from "@material-ui/icons/Feedback";
import GetAppIcon from "@material-ui/icons/GetApp";
import CategoryIcon from "@material-ui/icons/Category";
import FormatLineSpacingIcon from "@material-ui/icons/FormatLineSpacing";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import { Options } from "@/components/account/Options";
import { EditTypes } from "@/components/account/EditTypes";

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
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
  const typeCount = await Type.countDocuments({ option: owner.option });
  const types = await Type.find({ option: owner.option });
  const forms = await Form.countDocuments({
    option: owner.option,
    archived: false,
  });
  const archived = await Form.countDocuments({
    option: owner.option,
    archived: true,
  });
  const accounts = await User.find({ option: owner.option });
  const options = {};

  const typeNames = {};
  const typeTypes = {};
  const typeAdditional = {};
  const typeIdArr = [];

  for (let i = 0; i < types.length; i++) {
    typeNames[i] = types[i].name;
    typeTypes[i] = types[i].type;
    if (types[i].additional) {
      typeAdditional[i] = types[i].additional;
    }
    typeIdArr.push(types[i]._id)
  }

  for (let acc of accounts) {
    options[acc.email] = {
      role: acc.role || "",
      color: acc.color || "#607d8b",
      delete: acc.delete || false,
      create: acc.create || false,
    };
  }

  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
      accounts: JSON.parse(JSON.stringify(accounts)),
      types: JSON.parse(JSON.stringify(types)),
      typeIdArr: JSON.parse(JSON.stringify(typeIdArr)),
      options,
      typeCount,
      typeNames,
      typeTypes,
      typeAdditional,
      forms,
      archived,
    },
  };
}

export default function account({
  owner,
  typeCount,
  typeNames,
  typeTypes,
  typeAdditional,
  typeIdArr,
  forms,
  archived,
  options,
}) {
  const router = useRouter();
  const [accountPreferences, setAccountPrefrences] = useState(false);
  const [showAccountInvite, setShowAccountInvite] = useState(false);
  const [showUserPermissions, setShowUserPermissions] = useState(false);
  const [showEditCategories, setShowEditCategories] = useState(false);
  const colors = ["#673ab7", "#2196f3", "#f44336", "#009688", "#607d8b"];
  const [selected, setSelected] = useState(owner.color || colors[0]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});

  const editAccountHandler = (key, value) => {
    if (owner.admin) {
      const obj = {
        email: key,
        ...value,
      };
      setUser(obj);
      setShowUserPermissions(true);
    }
  };

  const themeHandler = () => {
    axios
      .post("/api/account/color", {
        owner,
        selected,
      })
      .then(router.push("/account"));
    setOpen(true);
    setMessage("Promjene spremljene.");
    setAccountPrefrences(false);
  };

  useEffect(() => {
    localStorage.setItem("theme", selected);
  }, [selected]);

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Container maxWidth="md">
        <div className="account-header">
          <Avatar>{owner.email[0]}</Avatar>
          <Typography variant="h5">Dobrodošao, {owner.email}</Typography>
          <Typography variant="body1">Promjenite postavke računa</Typography>
        </div>
        <Grid container spacing={3}>
          <AnimateSharedLayout>
            {accountPreferences ? (
              <Grid item xs={12} md={6}>
                <motion.div layoutId="payment" className="fab-form">
                  <Paper>
                    <List>
                      <ListItem button>
                        <ListItemIcon>
                          <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Korisničko ime"
                          secondary={owner.email.split("@")[0]}
                        />
                      </ListItem>
                      <Divider variant="middle" />
                      <ListItem>
                        <ListItemIcon>
                          <ColorLensIcon />
                        </ListItemIcon>
                        <AnimateSharedLayout>
                          <ul className="color-picker">
                            {colors.map((color) => (
                              <li
                                style={{ backgroundColor: color }}
                                key={color}
                                onClick={() => setSelected(color)}
                              >
                                {selected === color && (
                                  <motion.div
                                    layoutId="outline"
                                    className="outline"
                                    initial={false}
                                    animate={{ borderColor: color }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 500,
                                      damping: 30,
                                    }}
                                  />
                                )}
                              </li>
                            ))}
                          </ul>
                        </AnimateSharedLayout>
                      </ListItem>
                    </List>
                    <Divider />
                    <List>
                      <ListItem button onClick={themeHandler}>
                        <ListItemText primary="Spremite promjene" />
                      </ListItem>
                    </List>
                  </Paper>
                </motion.div>
              </Grid>
            ) : (
              <Grid item xs={12} md={6}>
                <motion.div layoutId="payment">
                  <Paper>
                    <List>
                      <ListItem button>
                        <ListItemIcon>
                          <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Korisničko ime"
                          secondary={owner.email.split("@")[0]}
                        />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <ColorLensIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Tema"
                          secondary="Promjenite temu računa"
                        />
                      </ListItem>
                    </List>
                    <Divider />
                    <List>
                      <ListItem
                        button
                        onClick={() => setAccountPrefrences(true)}
                      >
                        <ListItemText primary="Promjenite temu računa" />
                      </ListItem>
                    </List>
                  </Paper>
                </motion.div>
              </Grid>
            )}
          </AnimateSharedLayout>
          <Grid item xs={12} md={6}>
            <Paper>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <DataUsageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Podatci"
                    secondary="Iskorišteno 14/15 GB"
                  />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <GetAppIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Eksport podataka"
                    secondary="Preuzmite sve svoje podatke u CSV formatu"
                  />
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem button>
                  <ListItemText primary="Promjenite plan pretplate" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Unosi"
                    secondary={<>Ukupno dodano {forms} unosa</>}
                  />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Arhivi"
                    secondary={<>Arhivirano ukupno {archived} unosa</>}
                  />
                </ListItem>
              </List>
              <Divider />
              <List>
                <Link href="/all-items">
                  <ListItem button>
                    <ListItemText primary="Pregled svih unosa" />
                  </ListItem>
                </Link>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Polja za unos podataka"
                    secondary={<>Odabrano {typeCount} polja za unos podataka</>}
                  />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <FormatLineSpacingIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Raspored polja za unos"
                    secondary="Promjenite raspored polja za unos"
                  />
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem disabled={!typeCount} onClick={() => setShowEditCategories(true)} button>
                  <ListItemText primary="Promjenite kategorije" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <List>
                <ListItem button>
                  <ListItemText
                    primary={
                      <Typography variant="h5">Dodani korisnici</Typography>
                    }
                    secondary="Popis korisnika u vašem poduzeću"
                  />
                </ListItem>
                <Grid container spacing={4} className="members">
                  {Object.entries(options).map(([key, value]) => (
                    <Grid
                      item
                      xs={4}
                      md={3}
                      lg={2}
                      key={key}
                      className={owner.admin ? "card" : null}
                    >
                      <Avatar
                        className="avatar"
                        style={{ background: value.color }}
                        onClick={() => editAccountHandler(key, value)}
                      >
                        {key[0]}
                      </Avatar>
                      <Typography variant="body1">
                        {key.split("@")[0]}
                      </Typography>
                      <Typography variant="body2">{value.role}</Typography>
                    </Grid>
                  ))}
                  {owner.admin && (
                    <Grid item xs={4} md={3} lg={2} className="card">
                      <Avatar
                        style={{ background: "#5E14FF" }}
                        className="avatar"
                        onClick={() => setShowAccountInvite(true)}
                      >
                        +
                      </Avatar>
                      <Typography variant="body1">Dodajte račun</Typography>
                    </Grid>
                  )}
                </Grid>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <HelpOutlineIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Podrška"
                    secondary="Kontaktirajte nas za pomoć pri korištenju aplikacije"
                  />
                </ListItem>
                <Divider variant="middle" />
                <ListItem button>
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dokumentacija"
                    secondary="Pretražite dokumentaciju korištenja aplikacije"
                  />
                </ListItem>
                <Divider variant="middle" />
                <ListItem button>
                  <ListItemIcon>
                    <FeedbackIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Povratna informacija"
                    secondary="Pošaljite nam povratnu informaciju"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
        <AnimatePresence>
          {showAccountInvite && (
            <motion.div
              variants={formVariants}
              className="fab-form"
              initial="hidden"
              animate="visible"
              exit="exit"
              layoutId={"form-fab"}
            >
              <Options
                setShowOptions={setShowAccountInvite}
                setOpen={setOpen}
                owner={owner}
                setMessage={setMessage}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showUserPermissions && (
            <motion.div
              variants={formVariants}
              className="fab-form"
              initial="hidden"
              animate="visible"
              exit="exit"
              layoutId={"form-fab"}
            >
              <Options
                setShowOptions={setShowUserPermissions}
                setOpen={setOpen}
                owner={owner}
                user={user}
                setMessage={setMessage}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showEditCategories && (
            <motion.div
              variants={formVariants}
              className="fab-form"
              initial="hidden"
              animate="visible"
              exit="exit"
              layoutId={"form-fab"}
            >
              <EditTypes
                setShowEditCategories={setShowEditCategories}
                setOpen={setOpen}
                owner={owner}
                user={user}
                typeNames={typeNames}
                typeTypes={typeTypes}
                typeAdditional={typeAdditional}
                typeCount={typeCount}
                typeIdArr={typeIdArr}
                setMessage={setMessage}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Backdrop
          style={{ color: "#fff", zIndex: 9 }}
          open={
            accountPreferences ||
            showAccountInvite ||
            showUserPermissions ||
            showEditCategories
          }
        />
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
      </Container>
    </motion.div>
  );
}

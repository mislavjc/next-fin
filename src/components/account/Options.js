import { useState } from "react";
import { useRouter } from "next/router";
import Paper from "@material-ui/core/Paper";
import WorkIcon from "@material-ui/icons/Work";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import Switch from "@material-ui/core/Switch";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import TextField from "@material-ui/core/TextField";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

export const Options = ({
  setShowOptions,
  setOpen,
  user,
  owner,
  setMessage,
}) => {
  const router = useRouter();
  const [role, setRole] = useState(user?.role || "");
  const [email, setEmail] = useState(user?.email || "");
  const [add, setAdd] = useState(user?.create || false);
  const [del, setDel] = useState(user?.delete || false);

  const clickHandler = () => {
    axios
      .post("/api/add-account", {
        email,
        owner,
        role,
        add,
        del,
      })
      .then(setOpen(true), setShowOptions(false))
      .then(router.push("/account"));
    setOpen(true);
    if (user) {
      setMessage("Promjene spremljene.");
    } else {
      setMessage("Pozivnica poslana!");
    }
  };

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
              onClick={() => setShowOptions(false)}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Divider variant="middle" />
        <ListItem>
          <ListItemIcon>
            <AlternateEmailIcon />
          </ListItemIcon>
          <TextField
            id="email"
            type="email"
            label="Email adresa"
            variant="filled"
            value={email}
            disabled={user && true}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <TextField
            id="role"
            type="text"
            label="Naziv pozicije"
            variant="filled"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          />
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemIcon>
            <PlaylistAddIcon />
          </ListItemIcon>
          <ListItemText
            primary="Unos podataka"
            secondary="Dopuštenje za unos podataka"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={add}
              onChange={() => setAdd(!add)}
              color="primary"
              inputProps={{ "aria-label": "checkbox" }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <DeleteSweepIcon />
          </ListItemIcon>
          <ListItemText
            primary="Brisanje podataka"
            secondary="Dopuštenje za brisanje podataka"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={del}
              onChange={() => setDel(!del)}
              color="primary"
              inputProps={{ "aria-label": "checkbox" }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={clickHandler}>
          <ListItemText
            primary={user ? "Spremite promjene" : "Pošaljite pozivnicu"}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

import Paper from '@mui/material/Paper';
import WorkIcon from '@mui/icons-material/Work';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Switch from '@mui/material/Switch';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import TextField from '@mui/material/TextField';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export const Options = ({
  setShowOptions,
  setOpen,
  user,
  owner,
  setMessage,
}) => {
  const router = useRouter();
  const [role, setRole] = useState(user?.role || '');
  const [email, setEmail] = useState(user?.email || '');
  const [add, setAdd] = useState(user?.create || false);
  const [del, setDel] = useState(user?.delete || false);

  const clickHandler = () => {
    axios
      .post('/api/add-account', {
        email,
        owner,
        role,
        add,
        del,
      })
      .then(setOpen(true), setShowOptions(false))
      .then(router.push('/account'));
    setOpen(true);
    if (user) {
      setMessage('Promjene spremljene.');
    } else {
      setMessage('Pozivnica poslana!');
    }
  };

  return (
    <Paper>
      <List>
        <div style={{ display: 'flex', padding: '1rem' }}>
          <Typography variant="h5">
            {user ? 'Promjena postavki' : 'Unos novog računa'}
          </Typography>
          <Tooltip title="Zatvori">
            <IconButton
              style={{
                position: 'relative',
                top: '-8px',
                marginLeft: 'auto',
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
              inputProps={{ 'aria-label': 'checkbox' }}
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
              inputProps={{ 'aria-label': 'checkbox' }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={clickHandler}>
          <ListItemText
            primary={user ? 'Spremite promjene' : 'Pošaljite pozivnicu'}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

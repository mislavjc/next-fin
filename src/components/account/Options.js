import LocalizedStrings from 'react-localization';
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

import { useStrings } from '@/lib/use-strings';

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

  const { options } = useStrings(Strings);

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

  const removeHandler = () => {
    axios
      .post('/api/add-account/remove', {
        email,
        owner,
      })
      .then(setOpen(true), setShowOptions(false))
      .then(router.push('/account'));
    setOpen(true);
    setMessage('Korisnik obrisan.');
  };

  return (
    <Paper>
      <List>
        <div style={{ display: 'flex', padding: '1rem' }}>
          <Typography variant="h5">
            {user ? options.title[0] : options.title[1]}
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
            label={options.email}
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
            label={options.position}
            variant="filled"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          />
        </ListItem>
        <Divider variant="middle" />
        {user && (
          <List>
            <ListItem button onClick={removeHandler}>
              <ListItemText primary={options.delete} />
            </ListItem>
          </List>
        )}
        <ListItem>
          <ListItemIcon>
            <PlaylistAddIcon />
          </ListItemIcon>
          <ListItemText
            primary={options.addEntry.title}
            secondary={options.addEntry.subtitle}
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
            primary={options.deleteEntry.title}
            secondary={options.deleteEntry.subtitle}
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
            primary={user ? options.button[0] : options.button[1]}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

const Strings = new LocalizedStrings({
  en: {
    options: {
      title: ['Change settings', 'New account invite'],
      email: 'E-mail address',
      position: 'Employee title',
      addEntry: {
        title: 'Add data',
        subtitle: 'Permission for adding data',
      },
      deleteEntry: {
        title: 'Delete data',
        subtitle: 'Permission for deleting data',
      },
      button: ['Save changes', 'Send invitation'],
      delete: 'Remove user',
    },
  },
  hr: {
    options: {
      title: ['Promjena postavki', 'Unos novog računa'],
      email: 'E-mail addresa',
      position: 'Naziv pozicije',
      addEntry: {
        title: 'Unos podataka',
        subtitle: 'Dopuštenje za unos podataka',
      },
      deleteEntry: {
        title: 'Brisanje podataka',
        subtitle: 'Dopuštenje za brisanje podataka',
      },
      button: ['Spremite promjene', 'Pošaljite pozivnicu'],
      delete: 'Obriši korisnika',
    },
  },
});

import axios from 'axios';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CsvDownloader from 'react-csv-downloader';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StorageIcon from '@mui/icons-material/Storage';
import ArchiveIcon from '@mui/icons-material/Archive';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SearchIcon from '@mui/icons-material/Search';
import FeedbackIcon from '@mui/icons-material/Feedback';
import GetAppIcon from '@mui/icons-material/GetApp';
import CategoryIcon from '@mui/icons-material/Category';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import Snackbar from '@mui/material/Snackbar';

import { Options } from '@/components/account/Options';
import { EditTypes } from '@/components/account/EditTypes';

import Form from '@/models/form';
import User from '@/models/user';
import Type from '@/models/type';
import Option from '@/models/option';

import { dbConnect } from '@/middleware/db';
import { formVariants, containerVariants } from '@/lib/framer';


export async function getServerSideProps(context) {
  dbConnect();
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: '/api/auth/signin' });
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
  const option = await Option.findById(owner.option);
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
  const formData = await Form.find({
    option: owner.option,
  }).populate({
    path: 'inputs',
    populate: {
      path: 'type',
    },
  });
  const datas = [];
  for (let form of formData) {
    const obj = {};
    for (let input of form.inputs) {
      obj[input.type.name] = input.value;
    }
    datas.push(obj);
  }
  const accounts = await User.find({ option: owner.option });
  const options = {};

  const typeNames = {};
  const typeTypes = {};
  const typeRequired = {};
  const typeCurrency = {};
  const typeAdditional = {};
  const typeIdArr = {};

  for (const type of types) {
    let count = 0;
    if (typeNames.hasOwnProperty(type.title)) {
      count = Object.keys(typeNames[type.title]).length;
    } else {
      typeNames[type.title] = {};
      typeTypes[type.title] = {};
      typeRequired[type.title] = {};
      typeAdditional[type.title] = {};
      typeCurrency[type.title] = {};
      typeIdArr[type.title] = [];
    }
    typeNames[type.title][count] = type.name;
    typeTypes[type.title][count] = type.type;
    typeRequired[type.title][count] = type.required;
    typeIdArr[type.title].push(type._id);
    if (type.additional) {
      typeAdditional[type.title][count] = type.additional;
    }
    if (type.currency) {
      typeCurrency[type.title][count] = type.currency;
    }
  }

  for (let acc of accounts) {
    options[acc.email] = {
      role: acc.role || '',
      color: acc.color || '#607d8b',
      delete: acc.delete || false,
      create: acc.create || false,
    };
  }

  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
      option: JSON.parse(JSON.stringify(option)),
      accounts: JSON.parse(JSON.stringify(accounts)),
      types: JSON.parse(JSON.stringify(types)),
      typeIdArr: JSON.parse(JSON.stringify(typeIdArr)),
      datas: JSON.parse(JSON.stringify(datas)),
      options,
      typeCount,
      typeNames,
      typeTypes,
      typeRequired,
      typeCurrency,
      typeAdditional,
      forms,
      archived,
      hasMoreForms: option ? (option.titles.length > 1 ? true : false) : false,
    },
  };
}

export default function Account({
  owner,
  option,
  datas,
  typeCount,
  typeNames,
  typeTypes,
  typeRequired,
  typeCurrency,
  typeAdditional,
  typeIdArr,
  forms,
  archived,
  options,
  hasMoreForms,
}) {
  const router = useRouter();
  const [accountPreferences, setAccountPrefrences] = useState(false);
  const [showAccountInvite, setShowAccountInvite] = useState(false);
  const [showUserPermissions, setShowUserPermissions] = useState(false);
  const [showEditCategories, setShowEditCategories] = useState(false);
  const colors = ['#673ab7', '#2196f3', '#f44336', '#009688', '#607d8b'];
  const [selected, setSelected] = useState(owner.color || colors[0]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});
  const [selectedTitle, setSelectedTitle] = useState(
    option ? option.titles[0] : ''
  );

  const editTypesHandler = (title) => {
    setSelectedTitle(title);
    setShowEditCategories(true);
  };

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
      .post('/api/account/color', {
        owner,
        selected,
      })
      .then(router.push('/account'));
    setOpen(true);
    setMessage('Promjene spremljene.');
    setAccountPrefrences(false);
  };

  useEffect(() => {
    localStorage.setItem('theme', selected);
  }, [selected]);

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Container maxWidth="md">
        <div className="account-header">
          <Avatar>{owner.email[0]}</Avatar>
          <Typography variant="h5" align="center" color="textPrimary">
            Dobrodošao, {owner.email}
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            Promjenite postavke računa
          </Typography>
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
                          secondary={owner.email.split('@')[0]}
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
                                      type: 'spring',
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
                          secondary={owner.email.split('@')[0]}
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
                  <CsvDownloader
                    filename="unosi"
                    extension=".csv"
                    separator=";"
                    datas={datas}
                  >
                    <ListItemText
                      primary="Eksport podataka"
                      secondary="Preuzmite sve svoje podatke u CSV formatu"
                    />
                  </CsvDownloader>
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem disabled button>
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
                <Link href="/all-items" passHref>
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
                <ListItem disabled button>
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
                <ListItem
                  disabled={!typeCount || !owner.create}
                  onClick={() => router.push('/setup')}
                  button
                >
                  <ListItemText primary="Dodajte forme" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          {option && (
            <Grid item xs={12}>
              <Paper>
                <List>
                  <ListItem button>
                    <ListItemText
                      primary={
                        <Typography variant="h5">Dodane forme</Typography>
                      }
                      secondary="Popis kreiranih formi"
                    />
                  </ListItem>
                  <Grid container spacing={4} className="members">
                    {option.titles.map((title) => (
                      <Grid item xs={4} md={3} lg={2} key={title}>
                        <Avatar
                          className="avatar"
                          style={{ background: '#BDBDBD' }}
                          onClick={() => editTypesHandler(title)}
                        >
                          {title[0]}
                        </Avatar>
                        <Typography variant="body1">{title}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </List>
              </Paper>
            </Grid>
          )}
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
                      className={owner.admin ? 'card' : null}
                    >
                      <Avatar
                        className="avatar"
                        style={{ background: value.color }}
                        onClick={() => editAccountHandler(key, value)}
                      >
                        {key[0]}
                      </Avatar>
                      <Typography variant="body1">
                        {key.split('@')[0]}
                      </Typography>
                      <Typography variant="button" color="textSecondary">
                        {value.role}
                      </Typography>
                    </Grid>
                  ))}
                  {owner.admin && (
                    <Grid item xs={4} md={3} lg={2} className="card">
                      <Avatar
                        style={{ background: '#5E14FF' }}
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
              layoutId={'form-fab'}
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
              layoutId={'form-fab'}
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
              className="edit-categories"
              initial="hidden"
              animate="visible"
              exit="exit"
              layoutId={'form-fab'}
            >
              <EditTypes
                setShowEditCategories={setShowEditCategories}
                setOpen={setOpen}
                owner={owner}
                user={user}
                typeNames={typeNames[selectedTitle]}
                typeTypes={typeTypes[selectedTitle]}
                typeRequired={typeRequired[selectedTitle]}
                typeCurrency={typeCurrency[selectedTitle]}
                typeAdditional={typeAdditional[selectedTitle]}
                typeCount={typeIdArr[selectedTitle].length}
                typeIdArr={typeIdArr[selectedTitle]}
                setMessage={setMessage}
                selectedTitle={selectedTitle}
                option={option}
                hasMoreForms={hasMoreForms}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Backdrop
          style={{ color: '#fff', zIndex: 9 }}
          open={
            accountPreferences ||
            showAccountInvite ||
            showUserPermissions ||
            showEditCategories
          }
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
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

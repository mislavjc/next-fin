import axios from 'axios';
import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';
import CSVReader from 'react-csv-reader';
import { getSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Currency } from '@/components/setup/Currency';
import Snackbar from '@mui/material/Snackbar';

import { Field } from '@/components/setup/Field';
import { Type } from '@/components/setup/Type';
import { Additional } from '@/components/setup/Additional';
import { RelationTitle, RelationCategory } from '@/components/setup/Relation';

import User from '@/models/user';
import Option from '@/models/option';
import { default as Types } from '@/models/type';

import { formVariants, inputVariants } from '@/lib/framer';
import { useStrings } from '@/lib/use-strings';

import Strings from '@/translation/import/Strings';

const example = {
  en: [
    {
      name: 'Date',
      value: '5/6/2021',
      type: 'number',
    },
    {
      name: 'Delivery service',
      value: 'DPD',
      type: 'text',
    },
    {
      name: 'Price',
      value: '$100',
      type: 'text',
    },
  ],
  hr: [
    {
      name: 'Datum',
      value: '5/6/2021',
      type: 'number',
    },
    {
      name: '??pediter',
      value: 'DPD',
      type: 'text',
    },
    {
      name: 'Cijena',
      value: '100kn',
      type: 'text',
    },
  ],
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: '/api/auth/signin' });
    context.res.end();
    return {
      props: {
        session: false,
      },
    };
  }

  const { user } = session;
  const owner = await User.findOne({ email: user.email });
  const hasMoreForms = owner.option ? true : false;

  if (owner.option) {
    const option = await Option.findById(owner.option);
    const types = await Types.find({ option: owner.option });
    return {
      props: {
        session,
        owner: JSON.parse(JSON.stringify(owner)),
        option: JSON.parse(JSON.stringify(option)),
        types: JSON.parse(JSON.stringify(types)),
        hasMoreForms,
      },
    };
  }

  return {
    props: {
      session,
      owner: JSON.parse(JSON.stringify(owner)),
      hasMoreForms,
    },
  };
}

export default function Import({
  session,
  owner,
  option,
  types,
  hasMoreForms,
}) {
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
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [title, setTitle] = useState('');
  const [relationTitleObj, setRelationTitleObj] = useState({});
  const [relationCategoryObj, setRelationCategoryObj] = useState({});

  const router = useRouter();

  const form = example[router.locale];
  const { hero, header, formSection, snackbar } = useStrings(Strings);

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
          typeObj[i] = 'text';
        }
        setImportedValues(importedValues);
        setShowForm(true);
        setNameObj(nameObj);
        setHeaders(headers);
        const tempAdditionalObj = {};
        for (const [key, value] of Object.entries(nameObj)) {
          tempAdditionalObj[key] = [...new Set(importedValues[value])];
        }
        setAdditionalArr(tempAdditionalObj);
      } else {
        setImportedValues({});
        setHeaders([]);
        setMessage(snackbar.invalidFormat);
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
    }
    setAdditionalObj({ ...additionalObj, [index]: '' });
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
      title,
      relationCategoryObj,
    };
    if (!hasMoreForms) {
      axios.post('/api/import', values).then(router.push('/all-items'));
    } else {
      axios.post('/api/import/new', values).then(router.push('/all-items'));
    }
  };

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="landing-text">
        <Typography
          color="primary"
          variant="h2"
          component="h1"
          align="center"
          fontWeight={600}
        >
          {hero.title}
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          color="textPrimary"
        >
          {hero.subtitle}
        </Typography>
      </div>
      <div className="wrapper">
        <Button
          variant="outlined"
          color="primary"
          htmlFor="react-csv-reader-input"
        >
          <span style={{ position: 'absolute' }}>
            {hero.button[0]} <br /> {hero.button[1]}
          </span>
          <CSVReader
            cssClass="react-csv-input"
            onFileLoaded={(data) => setImported(data)}
          />
        </Button>
      </div>
      <Container maxWidth="sm" style={{ marginTop: '1rem' }}>
        {showForm && (
          <Grid item xs={12}>
            <form>
              <AnimateSharedLayout>
                <Paper variant="outlined" style={{ padding: '1rem' }}>
                  <Typography variant="h5">{header.title}</Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {header.subtitle}
                  </Typography>
                  <Typography
                    className="card"
                    variant="button"
                    color="textSecondary"
                    onClick={() => setShowExample(true)}
                    gutterBottom
                  >
                    {header.example.text}
                    <HelpOutlineIcon fontSize="inherit" />
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {formSection.title}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    id="categoryTitle"
                    name="categoryTitles"
                    label={formSection.titleField}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <motion.div
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {headers.map((header, index) => (
                      <motion.div
                        style={{ marginTop: '1rem' }}
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
                            hasMoreForms={hasMoreForms}
                          />
                          {typeObj[index] === 'currency' && (
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
                            label={formSection.required}
                            labelPlacement="top"
                          />
                        </div>
                        {hasMoreForms && typeObj[index] === 'relation' && (
                          <div className="relation-container">
                            <motion.div
                              style={{ marginTop: '1rem', marginLeft: '0' }}
                              variants={inputVariants}
                            >
                              <RelationTitle
                                value={relationTitleObj[index]}
                                onChange={(val) => {
                                  setRelationTitleObj({
                                    ...relationTitleObj,
                                    [index]: val,
                                  });
                                }}
                                option={option}
                              />
                            </motion.div>
                            {relationTitleObj[index] && (
                              <motion.div
                                style={{ marginTop: '1rem', marginLeft: '0' }}
                                variants={inputVariants}
                              >
                                <RelationCategory
                                  value={relationCategoryObj[index]}
                                  onChange={(val) => {
                                    setRelationCategoryObj({
                                      ...relationCategoryObj,
                                      [index]: val,
                                    });
                                  }}
                                  selectedTitle={relationTitleObj[index]}
                                  types={types}
                                />
                              </motion.div>
                            )}
                          </div>
                        )}
                        {typeObj[index] == 'dropdown' && (
                          <motion.div
                            style={{ marginTop: '1rem', marginLeft: '0' }}
                            variants={inputVariants}
                          >
                            <div
                              style={{ display: 'flex', marginBottom: '1rem' }}
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
                                style={{ marginLeft: '1rem' }}
                                onClick={() => additionalHandler(index)}
                              >
                                {formSection.add}
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
                          <Divider style={{ marginTop: '1rem' }} />
                        )}
                      </motion.div>
                    ))}
                    <motion.div layoutId={21}>
                      <Button
                        style={{ marginTop: '1rem' }}
                        color="primary"
                        variant="contained"
                        type="submit"
                        onClick={clickHandler}
                        disableElevation
                      >
                        {formSection.save}
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
              <Paper style={{ padding: '1rem' }} className="overscroll">
                <div style={{ display: 'flex' }}>
                  <Typography variant="h5">{header.example.title1}</Typography>
                  <Tooltip title="Zatvori">
                    <IconButton
                      style={{
                        position: 'relative',
                        top: '-8px',
                        marginLeft: 'auto',
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
                    style={{ marginBottom: '1rem' }}
                    fullWidth
                    variant="filled"
                    type={input.type}
                    id={input.name}
                    label={input.name}
                  />
                ))}
                <Divider variant="middle" style={{ margin: '1rem 0' }} />
                <Typography variant="h5" gutterBottom>
                  {header.example.title2}
                </Typography>
                <Paper>
                  <List>
                    {form.map((input, index) => (
                      <span key={index}>
                        <ListItem button className="card">
                          <span
                            style={{
                              overflowWrap: 'break-word',
                              width: '25%',
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
                              overflowWrap: 'break-word',
                              width: '75%',
                              paddingLeft: '0.5rem',
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
                      <span style={{ marginLeft: 'auto' }}>
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
                          <Tooltip title="Obri??i">
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
        <Backdrop style={{ color: '#fff', zIndex: 9 }} open={showExample} />
      </Container>
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
    </div>
  );
}

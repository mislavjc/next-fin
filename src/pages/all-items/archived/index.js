import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import { getSession } from 'next-auth/client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';

import { CardItem } from '@/components/CardItem';
import { Input } from '@/components/fields/Input';
import { CollectionSelect } from '@/components/CollectionSelect';

import Form from '@/models/form';
import User from '@/models/user';
import Type from '@/models/type';
import { default as Inputs } from '@/models/input';
import Option from '@/models/option';

import { Toolbar } from '@/components/Toolbar';

import { dbConnect } from '@/middleware/db';
import { uploadFile } from '@/middleware/uploadFile';
import { formVariants, cardVariants } from '@/lib/framer';
import { mapAndReduce } from '@/lib/filter';
import { useStrings } from '@/lib/use-strings';

import Strings from '@/translation/all-items/Strings';

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
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const cloudinaryPreset = process.env.CLOUDINARY_UNSIGNED_UPLOAD_PRESET;
  const { user } = session;
  const owner = await User.findOne({ email: user.email });
  const types = await Type.find({ option: owner.option });
  const option = await Option.findById(owner.option);
  const inputs = await Inputs.find({ option: owner.option });
  const forms = await Form.find({
    option: owner.option,
    archived: true,
  }).populate({
    path: 'inputs',
    populate: {
      path: 'type',
    },
  });

  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
      types: JSON.parse(JSON.stringify(types)),
      forms: JSON.parse(JSON.stringify(forms)),
      option: JSON.parse(JSON.stringify(option)),
      inputs: JSON.parse(JSON.stringify(inputs)),
      cloudinaryUrl,
      cloudinaryPreset,
    },
  };
}

export default function AllItems({
  owner,
  types,
  forms,
  option,
  inputs,
  cloudinaryUrl,
  cloudinaryPreset,
}) {
  const [showForm, setShowForm] = useState(false);
  const [dataObj, setDataObj] = useState({});
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState({});
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(forms);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const attachments = [];
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(
    option ? option.titles[0] : ''
  );
  const [columnTypes, setColumnTypes] = useState(types);

  const { formStrings } = useStrings(Strings);

  useEffect(() => {
    axios
      .post('/api/crud/read', {
        title: selectedTitle,
        owner,
        archived: true,
      })
      .then((res) => {
        setEntries(res.data.forms);
        setColumnTypes(res.data.types);
      })
      .then(() => setDataObj({}))
      .then(() => localStorage.setItem('selectedTitle', selectedTitle));
  }, [selectedTitle]);

  useEffect(() => {
    if (localStorage.getItem('selectedTitle')) {
      setSelectedTitle(localStorage.getItem('selectedTitle'));
    }
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      axios
        .post('/api/search', { search, option: owner.option })
        .then((res) => setEntries(res.data));
    } else {
      setEntries(forms);
    }
  }, [search]);

  const openFormHandler = () => {
    if (owner.create) {
      setShowForm(true);
    } else {
      setMessage('Nemate prava za dodavanje unosa!');
      setOpen(true);
    }
  };

  const fileSelect = useRef(null);

  const handleFiles = (files) => {
    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      attachments.push(uploadFile(files[i], cloudinaryUrl, cloudinaryPreset));
    }
    setIsUploading(false);
  };

  const clickHandler = () => {
    setIsSubmitted(true);
    let isSubmittable = true;
    for (let i = 0; i < types.length; i++) {
      if (
        !dataObj[types[i]._id] &&
        types[i].required &&
        types[i].title === selectedTitle
      ) {
        isSubmittable = false;
      }
    }
    if (isSubmittable) {
      setShowForm(false);
      if (owner.create) {
        const currentUser = owner._id;
        const values = {
          currentUser,
          dataObj,
          title: selectedTitle,
        };
        if (attachments.length > 0) {
          values.attachments = attachments;
        }
        axios
          .post('/api/crud/create', values)
          .then((entry) => setEntries([...entries, entry.data]))
          .then(
            setMessage('Dodan unos!'),
            setOpen(true),
            setIsSubmitted(false)
          );
      } else {
        setMessage('Nemate prava za dodavanje unosa!');
        setOpen(true);
      }
    }
  };

  const editHandler = () => {
    setIsSubmitted(true);
    let isSubmittable = true;
    for (let i = 0; i < types.length; i++) {
      if (dataObj[types[i]._id] === '' && types[i].required) {
        isSubmittable = false;
      }
    }
    if (isSubmittable) {
      setShowEditForm(false);
      if (owner.create) {
        const currentUser = owner._id;
        const values = {
          currentUser,
          dataObj,
          form: initialValue._id,
          owner,
          title: selectedTitle,
        };
        axios
          .put('/api/crud/edit', values)
          .then((entry) => setEntries([...entry.data]))
          .then(
            setMessage('Uspješno promjenjen unos!'),
            setOpen(true),
            setIsSubmitted(false)
          );
      } else {
        setMessage('Nemate prava za promjenu unosa!');
        setOpen(true);
      }
    }
  };

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Container maxWidth="lg">
        <Toolbar
          search={search}
          setSearch={setSearch}
          owner={owner}
          inputs={mapAndReduce(entries)}
        />
        {option && (
          <CollectionSelect
            option={option}
            value={selectedTitle}
            onChange={setSelectedTitle}
          />
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
                        owner={owner}
                        setShowEditForm={setShowEditForm}
                        setInitialValue={setInitialValue}
                        onClose={() => {
                          setShowMore({ ...showMore, [form._id]: false });
                        }}
                        showBack={showMore[form._id]}
                        columnTypes={columnTypes}
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
                        owner={owner}
                        setShowEditForm={setShowEditForm}
                        setInitialValue={setInitialValue}
                        onOpen={() =>
                          setShowMore({ ...showMore, [form._id]: true })
                        }
                        columnTypes={columnTypes}
                      />
                    </motion.div>
                  )}
                  <Backdrop
                    style={{ color: '#fff', zIndex: 8 }}
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
            color="primary"
            aria-label="add"
            className="fab"
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
            layoutId={'form-fab'}
          >
            <Paper style={{ padding: '1rem' }}>
              <div style={{ display: 'flex' }}>
                <Typography variant="h5">{formStrings.new}</Typography>
                <Tooltip title="Zatvori">
                  <IconButton
                    style={{
                      position: 'relative',
                      top: '-8px',
                      marginLeft: 'auto',
                    }}
                    onClick={() => {
                      setShowForm(false), setIsSubmitted(false);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </div>
              {types.map((type) => {
                if (type.title === selectedTitle) {
                  return (
                    <div style={{ marginBottom: '1rem' }} key={type._id}>
                      <Input
                        name={type.name}
                        type={type.type}
                        required={type.required}
                        currency={type.currency}
                        id={type._id}
                        dataObj={dataObj}
                        setDataObj={setDataObj}
                        additional={type.additional || null}
                        isSubmitted={isSubmitted}
                        inputs={inputs}
                        relation={type._relation}
                      />
                    </div>
                  );
                }
              })}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  style={{ display: 'none' }}
                  accept="image/*, .pdf"
                  onChange={(e) => handleFiles(e.target.files)}
                  id="contained-button-file"
                  multiple
                  type="file"
                  ref={fileSelect}
                />
                <label htmlFor="contained-button-file">
                  <Button variant="outlined" color="primary" component="span">
                    {formStrings.attachment}
                  </Button>
                </label>
              </div>
              <Button
                onClick={clickHandler}
                variant="contained"
                size="large"
                color="primary"
                disabled={isUploading ? true : false}
              >
                {formStrings.button}
              </Button>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showEditForm && (
          <motion.div
            variants={formVariants}
            className="fab-form"
            initial="hidden"
            animate="visible"
            exit="exit"
            layoutId={'form-fab'}
          >
            <Paper style={{ padding: '1rem' }}>
              <div style={{ display: 'flex' }}>
                <Typography variant="h5">{formStrings.edit}</Typography>
                <Tooltip title="Zatvori">
                  <IconButton
                    style={{
                      position: 'relative',
                      top: '-8px',
                      marginLeft: 'auto',
                    }}
                    onClick={() => {
                      setShowForm(false), setShowEditForm(false);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </div>
              {types.map((type) => {
                if (type.title === selectedTitle) {
                  return (
                    <div style={{ marginBottom: '1rem' }} key={type._id}>
                      <Input
                        name={type.name}
                        type={type.type}
                        required={type.required}
                        currency={type.currency}
                        id={type._id}
                        dataObj={dataObj}
                        setDataObj={setDataObj}
                        initialValue={initialValue}
                        additional={type.additional || null}
                        isSubmitted={isSubmitted}
                        inputs={inputs}
                        relation={type._relation}
                      />
                    </div>
                  );
                }
              })}
              <Button
                onClick={editHandler}
                variant="contained"
                size="large"
                color="primary"
              >
                {formStrings.button}
              </Button>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      <Backdrop
        style={{ color: '#fff', zIndex: 9 }}
        open={showForm || showEditForm}
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
    </div>
  );
}

import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { motion, AnimateSharedLayout } from 'framer-motion';
import { Field } from '@/components/setup/Field';
import { Type } from '@/components/setup/Type';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { Additional } from '@/components/setup/Additional';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Currency } from '@/components/setup/Currency';
import { inputVariants } from '@/lib/framer';

export const EditTypes = ({
  setShowEditCategories,
  setOpen,
  user,
  owner,
  typeCount,
  typeNames,
  typeTypes,
  typeRequired,
  typeCurrency,
  typeAdditional,
  typeIdArr,
  setMessage,
  selectedTitle,
}) => {
  const [nameObj, setNameObj] = useState(typeNames);
  const [typeObj, setTypeObj] = useState(typeTypes);
  const [requiredObj, setRequiredObj] = useState(typeRequired);
  const [additionalObj, setAdditionalObj] = useState({});
  const [currencyObj, setCurrencyObj] = useState(typeCurrency);
  const [count, setCount] = useState(typeCount);
  const [arr, setArr] = useState([]);
  const [additionalArr, setAdditionalArr] = useState(typeAdditional || {});

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

  const submitHandler = () => {
    const values = {
      owner,
      names: nameObj,
      types: typeObj,
      required: requiredObj,
      currency: currencyObj,
      additional: additionalArr,
      typeIdArr,
      title: selectedTitle,
      count,
    };
    axios
      .post('/api/account/update-types', values)
      .then(
        setShowEditCategories(false),
        setOpen(true),
        setMessage('Uspješno promjenjene postavke.')
      );
  };

  const categoryArr = [];
  useEffect(() => {
    if (count < 19) {
      for (let i = 0; i < count; i++) {
        categoryArr.push(i);
      }
      setArr(categoryArr);
    }
  }, [count]);

  return (
    <Paper>
      <List>
        <div style={{ display: 'flex', padding: '1rem 1rem 0 1rem' }}>
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
              onClick={() => setShowEditCategories(false)}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Typography
          variant="overline"
          color="textSecondary"
          display="block"
          gutterBottom
          style={{ paddingLeft: '1rem' }}
        >
          Iskorišteno {count} / 20
        </Typography>
        <Divider variant="middle" />
        <div className="overscroll">
          <AnimateSharedLayout>
            {arr.map((category, index) => (
              <div className="list-form" key={category}>
                <div className="setup-fields" style={{ marginTop: '1rem' }}>
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
                  {typeObj[index] === 'currency' && (
                    <motion.div variants={inputVariants}>
                      <Currency
                        value={currencyObj[index]}
                        onChange={(val) => {
                          setCurrencyObj({ ...currencyObj, [index]: val });
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
                {typeObj[index] == 'dropdown' && (
                  <motion.div
                    style={{ marginTop: '1rem', marginLeft: '0' }}
                    variants={inputVariants}
                  >
                    <div style={{ display: 'flex', marginBottom: '1rem' }}>
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
                        Dodaj
                      </Button>
                    </div>
                    {additionalArr[index] &&
                      additionalArr[index].map((additional, i) => (
                        <motion.span variants={inputVariants} key={additional}>
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
                {index === arr.length - 1 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <ButtonGroup color="primary" variant="outlined">
                      {count < 19 && (
                        <Button onClick={() => setCount(count + 1)}>+</Button>
                      )}
                    </ButtonGroup>
                  </div>
                )}
                {index !== arr.length - 1 && (
                  <Divider style={{ marginTop: '1rem' }} />
                )}
              </div>
            ))}
          </AnimateSharedLayout>
        </div>
      </List>
      <Divider />
      <List>
        <ListItem onClick={submitHandler} button>
          <ListItemText primary="Spremite promjene" />
        </ListItem>
      </List>
    </Paper>
  );
};

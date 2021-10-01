import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { nanoid } from 'nanoid';

import DateAdapter from '@mui/lab/AdapterDayjs';

import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

export const Input = ({
  name,
  type,
  id,
  dataObj,
  setDataObj,
  initialValue,
  additional,
  currency,
  required,
  isSubmitted,
}) => {
  let valueId = id;
  const inputValue = () => {
    if (initialValue) {
      for (let value of initialValue.inputs) {
        if (value.type._id === id) {
          valueId = value._id;
          return value.value;
        }
      }
    }
    if (type === 'date') {
      return new Date();
    }
    return '';
  };
  const [value, setValue] = useState(inputValue());
  const [error, setError] = useState(false);
  const errorMessage = 'Polje ne smije biti prazno.';
  const [selectedDate, handleDateChange] = useState(value || new Date());

  useEffect(() => {
    dataObj[valueId] = selectedDate;
    setDataObj(dataObj);
  }, [selectedDate, handleDateChange]);

  useEffect(() => {
    if (isSubmitted && value === '' && required) {
      setError(true);
    } else {
      setError(false);
    }
    if (type === 'uuid') {
      dataObj[valueId] = nanoid();
    } else {
      dataObj[valueId] = value;
    }
    setDataObj(dataObj);
  }, [value, isSubmitted]);
  if (type === 'dropdown') {
    return (
      <FormControl variant="filled" fullWidth error={error}>
        <InputLabel id={`labelid${id}`}>{name}</InputLabel>
        <Select
          value={value ? value : ''}
          onChange={(e) => setValue(e.target.value)}
          labelId={`labelid${id}`}
          id={`id${id}`}
        >
          {additional.map((additional) => (
            <MenuItem value={additional} key={additional}>
              {additional}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
  if (type === 'date') {
    return (
      <LocalizationProvider dateAdapter={DateAdapter}>
        <MobileDatePicker
          label={name}
          inputFormat="DD.MM.YYYY"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField {...params} fullWidth variant="filled" />
          )}
        />
      </LocalizationProvider>
    );
  }
  if (type === 'textarea') {
    return (
      <TextField
        error={error}
        helperText={error ? errorMessage : null}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        variant="filled"
        type={type}
        id={name}
        name={name}
        label={name}
        multiline
        rows={4}
      />
    );
  }
  if (type === 'currency') {
    return (
      <TextField
        error={error}
        helperText={error ? errorMessage : null}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        variant="filled"
        type={type}
        id={name}
        name={name}
        label={name}
        InputProps={
          currency !== '£'
            ? {
                endAdornment: (
                  <InputAdornment position="end">{currency}</InputAdornment>
                ),
              }
            : {
                startAdornment: (
                  <InputAdornment position="start">{currency}</InputAdornment>
                ),
              }
        }
      />
    );
  }
  if (type === 'uuid') {
    return (
      <TextField
        disabled
        value={value ? value : nanoid()}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        variant="filled"
        id={name}
        type={type}
        name={name}
        label={name}
      />
    );
  }
  return (
    <TextField
      error={error}
      helperText={error ? errorMessage : null}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      fullWidth
      variant="filled"
      id={name}
      type={type}
      name={name}
      label={name}
    />
  );
};

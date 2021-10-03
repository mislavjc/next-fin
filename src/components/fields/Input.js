import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import DateAdapter from '@mui/lab/AdapterDayjs';

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
  inputs,
  relation,
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
  const [autocompleteValue, setAutocompleteValue] = useState('');
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
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={autocompleteValue}
        onInputChange={(event, newAutocompleteValue) => {
          setAutocompleteValue(newAutocompleteValue);
        }}
        options={additional}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            helperText={error ? errorMessage : null}
            fullWidth
            variant="filled"
            id={name}
            type={type}
            name={name}
            label={name}
          />
        )}
      />
    );
  }
  if (type === 'relation') {
    return (
      <Autocomplete
        options={inputs
          .filter((input) => input.type === relation)
          .map((input) => input.value)}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={autocompleteValue}
        onInputChange={(event, newAutocompleteValue) => {
          setAutocompleteValue(newAutocompleteValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            helperText={error ? errorMessage : null}
            fullWidth
            variant="filled"
            id={name}
            type={type}
            name={name}
            label={name}
          />
        )}
      />
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

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

import Chip from '@mui/material/Chip';
import TocIcon from '@mui/icons-material/Toc';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArchiveIcon from '@mui/icons-material/Archive';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export const Toolbar = ({ setSearch, owner, inputs }) => {
  const router = useRouter();

  const [autocompleteValue, setAutocompleteValue] = useState('')

  return (
    <div className="toolbar">
      <div>
        <Link href="/all-items" passHref>
          <Chip
            icon={<DashboardIcon />}
            label="Kartični pregled"
            variant={router.asPath === '/all-items' ? 'default' : 'outlined'}
            color="primary"
          />
        </Link>
      </div>
      <div>
        <Link href="/table" passHref>
          <Chip
            icon={<TocIcon />}
            label="Tablični pregled"
            variant={router.asPath === '/table' ? 'default' : 'outlined'}
            color="primary"
          />
        </Link>
      </div>
      <div>
        <Link href="/all-items/archived" passHref>
          <Chip
            icon={<ArchiveIcon />}
            label="Arhivirani unosi"
            variant={
              router.asPath === '/all-items/archived' ? 'default' : 'outlined'
            }
            color="primary"
          />
        </Link>
      </div>
      <Autocomplete
        className="search"
        disabled={!owner.option}
        multiple
        id="search"
        options={inputs}
        onChange={(event, newValue) => {
          setSearch(newValue);
        }}
        inputValue={autocompleteValue}
        onInputChange={(event, newAutocompleteValue) => {
          setAutocompleteValue(newAutocompleteValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Pretražite unose"
          />
        )}
      />
    </div>
  );
};

import Link from 'next/link';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Chip from '@mui/material/Chip';
import TocIcon from '@mui/icons-material/Toc';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

export const Toolbar = ({ search, setSearch, owner }) => {
  const router = useRouter();

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
      <Paper className="search">
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          disabled={!owner.option}
          className="search"
          placeholder="Pretražite unose"
          inputProps={{ 'aria-label': 'pretražite unose' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>
    </div>
  );
};

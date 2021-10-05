import LocalizedStrings from 'react-localization';
import { useState } from 'react';
import { useRouter } from 'next/router';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TocIcon from '@mui/icons-material/Toc';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArchiveIcon from '@mui/icons-material/Archive';

import { useStrings } from '@/lib/use-strings';

export const BottomNav = () => {
  const router = useRouter();
  const [value, setValue] = useState(router.pathname);

  const { bottomNav } = useStrings(Strings);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.push(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      className="bottom-nav"
    >
      <BottomNavigationAction
        label={bottomNav.cardView}
        value="/all-items"
        icon={<DashboardIcon />}
      />
      <BottomNavigationAction
        label={bottomNav.tableView}
        value="/table"
        icon={<TocIcon />}
      />
      <BottomNavigationAction
        label={bottomNav.archive}
        value="/all-items/archived"
        icon={<ArchiveIcon />}
      />
    </BottomNavigation>
  );
};

const Strings = new LocalizedStrings({
  en: {
    bottomNav: {
      cardView: 'Cards',
      tableView: 'Table',
      archive: 'Archived',
    },
  },
  hr: {
    bottomNav: {
      cardView: 'Kartice',
      tableView: 'Tablica',
      archive: 'Arhivi',
    },
  },
});

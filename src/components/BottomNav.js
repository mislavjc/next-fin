import { useState } from 'react';
import { useRouter } from 'next/router';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TocIcon from '@mui/icons-material/Toc';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArchiveIcon from '@mui/icons-material/Archive';

export const BottomNav = () => {
  const router = useRouter();
  const [value, setValue] = useState(router.pathname);

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
        label="Kartice"
        value="/all-items"
        icon={<DashboardIcon />}
      />
      <BottomNavigationAction
        label="Tablica"
        value="/table"
        icon={<TocIcon />}
      />
      <BottomNavigationAction
        label="Arhivi"
        value="/all-items/archived"
        icon={<ArchiveIcon />}
      />
    </BottomNavigation>
  );
};

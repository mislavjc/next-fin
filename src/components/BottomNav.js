import { useState } from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import TocIcon from "@material-ui/icons/Toc";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ArchiveIcon from "@material-ui/icons/Archive";
import { useRouter } from "next/router";

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

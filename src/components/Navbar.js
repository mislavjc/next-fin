import Link from "next/link";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";

export const Navbar = () => {
  const [session, loading] = useSession();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <nav>
        <img
          className="logo"
          src="/icons/logo.svg"
          alt="logo"
          width="40px"
          height="40px"
        />
        <div>
          <img src="/icons/logo.svg" alt="logo" width="40px" height="40px" />
          <Link href="/">Naslovnica</Link>
          <Link href="/form">Aplikacija</Link>
          <Link href="/all-items">Svi</Link>
          <div className="account">
            {session && !loading ? (
              <div>
                <Button variant="outlined" className="btn" onClick={signOut}>
                  Sign out
                </Button>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </div>
            ) : (
              <Button variant="outlined" className="btn" onClick={signIn}>
                Sign in
              </Button>
            )}
          </div>
        </div>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          className="nav-menu"
        >
          <MenuIcon />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link href="/">Naslovnica</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link href="/form">Aplikacija</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link href="/all-items">Svi</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <div className="account">
              {session && !loading ? (
                <div>
                  <Button variant="outlined" className="btn" onClick={signOut}>
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button variant="outlined" className="btn" onClick={signIn}>
                  Sign in
                </Button>
              )}
            </div>
          </MenuItem>
        </Menu>
      </nav>
    </>
  );
};

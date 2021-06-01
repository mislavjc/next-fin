import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import GetAppIcon from "@material-ui/icons/GetApp";

export const Navbar = () => {
  const [session, loading] = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (session) {
      setName(session.user.email[0]);
    }
  }, [session]);

  return (
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
        <div className="account">
          {session && !loading ? (
            <div>
              <IconButton
                aria-label="account of current user"
                color="inherit"
                onClick={handleClick}
              >
                <Avatar>{name}</Avatar>
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <List style={{ paddingRight: "1rem", cursor: "pointer" }}>
                  <Link href="/account">
                    <ListItem onClick={handleClose}>
                      <ListItemAvatar>
                        <Avatar>
                          <AccountCircleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Račun" />
                    </ListItem>
                  </Link>
                  <Divider variant="inset" component="li" />
                  <Link href="/">
                    <ListItem>
                      <ListItemAvatar onClick={handleClose}>
                        <Avatar>
                          <SupervisorAccountIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Više računa"
                        secondary="Dodajte račune"
                      />
                    </ListItem>
                  </Link>
                  <Divider variant="inset" component="li" />
                  <Link href="/">
                    <ListItem>
                      <ListItemAvatar onClick={handleClose}>
                        <Avatar>
                          <GetAppIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Eksport podataka"
                        secondary="Skinite sve unose"
                      />
                    </ListItem>
                  </Link>
                  <Divider variant="inset" component="li" />
                  <ListItem onClick={signOut}>
                    <ListItemAvatar>
                      <Avatar>
                        <MeetingRoomIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Odjava" />
                  </ListItem>
                </List>
              </Menu>
            </div>
          ) : (
            <Button variant="outlined" className="btn" onClick={signIn}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

import LocalizedStrings from 'react-localization';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/client';
import Image from 'next/image';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import GetAppIcon from '@mui/icons-material/GetApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import TranslateIcon from '@mui/icons-material/Translate';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TocIcon from '@mui/icons-material/Toc';

import { useStrings } from '@/lib/use-strings';

export const Navbar = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState(null);
  const [darkMode, setDarkMode] = useState('false');
  const [color, setColor] = useState(null);

  const { navbar } = useStrings(Strings);

  const lightModeHandler = () => {
    setDarkMode(false);
    router.reload(window.location.pathname);
  };

  const darkModeHandler = () => {
    setDarkMode(true);
    router.reload(window.location.pathname);
  };

  useEffect(() => {
    setDarkMode(localStorage.getItem('darkMode'));
    setColor(localStorage.getItem('theme'));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

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
      <span className="logo">
        <Image
          src="/icons/logo.svg"
          alt="logo"
          width="40px"
          height="40px"
          onClick={() => router.push('/all-items')}
        />
      </span>
      <div>
        <Image
          src="/icons/logo.svg"
          alt="logo"
          width="40px"
          height="40px"
          onClick={() => router.push('/all-items')}
        />
        <div className="account">
          <div>
            {darkMode === 'true' ? (
              <IconButton onClick={lightModeHandler}>
                <BrightnessHighIcon />
              </IconButton>
            ) : (
              <IconButton onClick={darkModeHandler}>
                <Brightness4Icon />
              </IconButton>
            )}
            <IconButton
              aria-label="account of current user"
              onClick={handleClick}
            >
              <Avatar style={{ background: color }}>{name}</Avatar>
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <List style={{ paddingRight: '1rem', cursor: 'pointer' }}>
                {session && !loading ? (
                  <>
                    <Link href="/account" passHref>
                      <ListItem onClick={handleClose}>
                        <ListItemAvatar>
                          <Avatar>
                            <AccountCircleIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={navbar.account} />
                      </ListItem>
                    </Link>
                    <Divider variant="inset" component="li" />
                    <Link href="/account" passHref>
                      <ListItem onClick={handleClose}>
                        <ListItemAvatar>
                          <Avatar>
                            <SupervisorAccountIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={navbar.moreAccounts.title}
                          secondary={navbar.moreAccounts.subtitle}
                        />
                      </ListItem>
                    </Link>
                    <Link href="/account" passHref>
                      <ListItem onClick={handleClose}>
                        <ListItemAvatar>
                          <Avatar>
                            <GetAppIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={navbar.export.title}
                          secondary={navbar.export.subtitle}
                        />
                      </ListItem>
                    </Link>
                    <Divider variant="inset" component="li" />
                    <Link href="/all-items" passHref>
                      <ListItem onClick={handleClose}>
                        <ListItemAvatar>
                          <Avatar>
                            <TocIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={navbar.items.title}
                          secondary={navbar.items.subtitle}
                        />
                      </ListItem>
                    </Link>
                    <Link href="/statistics" passHref>
                      <ListItem onClick={handleClose}>
                        <ListItemAvatar>
                          <Avatar>
                            <QueryStatsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={navbar.statistics.title}
                          secondary={navbar.statistics.subtitle}
                        />
                      </ListItem>
                    </Link>
                    <Divider variant="inset" component="li" />
                    <span
                      onClick={() => {
                        const setCookie = (locale) => {
                          document.cookie = `NEXT_LOCALE=${locale}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
                        };
                        const locale = router.locale === 'en' ? 'hr' : 'en';
                        setCookie(locale);
                        router.push(`/${locale}`, `/${locale}`, {
                          locale: false,
                        });
                      }}
                    >
                      <ListItem onClick={handleClose}>
                        <ListItemAvatar>
                          <Avatar>
                            <TranslateIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            router.locale === 'hr' ? 'English' : 'Hrvatski'
                          }
                        />
                      </ListItem>
                    </span>
                    <ListItem onClick={signOut}>
                      <ListItemAvatar>
                        <Avatar>
                          <MeetingRoomIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={navbar.logout} />
                    </ListItem>
                  </>
                ) : (
                  <>
                    <span
                      onClick={() => {
                        const setCookie = (locale) => {
                          document.cookie = `NEXT_LOCALE=${locale}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
                        };
                        const locale = router.locale === 'en' ? 'hr' : 'en';
                        setCookie(locale);
                        router.push(`/${locale}`, `/${locale}`, {
                          locale: false,
                        });
                      }}
                    >
                      <ListItem onClick={handleClose}>
                        <ListItemAvatar>
                          <Avatar>
                            <TranslateIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            router.locale === 'hr' ? 'English' : 'Hrvatski'
                          }
                        />
                      </ListItem>
                    </span>
                    <Divider variant="inset" component="li" />
                    <ListItem onClick={signIn}>
                      <ListItemAvatar>
                        <Avatar>
                          <MeetingRoomIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={navbar.login} />
                    </ListItem>
                  </>
                )}
              </List>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Strings = new LocalizedStrings({
  en: {
    navbar: {
      account: 'Account',
      moreAccounts: {
        title: 'Multiple accounts',
        subtitle: 'Add multiple accounts',
      },
      export: {
        title: 'Excel export',
        subtitle: 'Download all your entries',
      },
      items: {
        title: 'All entries',
        subtitle: 'View all entries',
      },
      statistics: {
        title: 'Statistics',
        subtitle: 'View your statistics',
      },
      logout: 'Log out',
      login: 'Log in',
    },
  },
  hr: {
    navbar: {
      account: 'Račun',
      moreAccounts: {
        title: 'Više računa',
        subtitle: 'Dodajte više računa',
      },
      export: {
        title: 'Eksport podataka',
        subtitle: 'Skinite sve unose',
      },
      items: {
        title: 'Svi unosi',
        subtitle: 'Pregled svih unosa',
      },
      statistics: {
        title: 'Statistke',
        subtitle: 'Pregledajte svoje statistike',
      },
      logout: 'Odjava',
      login: 'Prijavite se',
    },
  },
});

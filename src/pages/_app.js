import Head from 'next/head';
import { Provider } from 'next-auth/client';
import '@/styles/global.scss';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { createTheme, ThemeProvider } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { useState, useEffect } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[800],
    },
  },
  typography: {
    fontFamily: 'Inter',
  },
});

const lightTheme = createTheme({
  ...theme,
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: deepPurple[100],
    },
  },
});

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState('false');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setDarkMode(localStorage.getItem('darkMode'));
  }, [mounted]);

  const themeConfig = darkMode === 'true' ? darkTheme : lightTheme;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FIN</title>
      </Head>
      <Provider session={pageProps.session}>
        <ThemeProvider theme={themeConfig}>
          <Navbar />
          <Component {...pageProps} />
          <BottomNav />
        </ThemeProvider>
      </Provider>
      <style jsx global>{`
        body {
          background: ${darkMode === 'true' ? '#333' : 'white'};
        }
      `}</style>
    </>
  );
}

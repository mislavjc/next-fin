import Head from "next/head";
import { Provider } from "next-auth/client";
import "@/css/main.min.css";
import { Navbar } from "@/components/Navbar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { deepPurple } from "@material-ui/core/colors";
import { useState, useEffect } from "react";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepPurple[800],
    },
  },
  typography: {
    fontFamily: "Inter",
  },
});

const lightTheme = createMuiTheme({
  ...theme,
  palette: {
    type: "light",
  },
});

const darkTheme = createMuiTheme({
  ...theme,
  palette: {
    type: "dark",
    primary: {
      main: deepPurple[100],
    },
  },
});

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState("false");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setDarkMode(localStorage.getItem("darkMode"));
  }, [mounted]);

  const themeConfig = darkMode === "true" ? darkTheme : lightTheme;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <title>FIN</title>
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="FIN je platforma koja olakšava evidenciju poslovnih procesa, jednostavna je za korištenje te je dostupna bilo kada i bilo gdje."
        />
        <meta
          name="og:description"
          content="FIN je platforma koja olakšava evidenciju poslovnih procesa, jednostavna je za korištenje te je dostupna bilo kada i bilo gdje."
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
      </Head>
      <Provider session={pageProps.session}>
        <ThemeProvider theme={themeConfig}>
          <Navbar />
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
      <style jsx global>{`
        body {
          background: ${darkMode === "true" ? "#333" : "white"};
        }
      `}</style>
    </>
  );
}

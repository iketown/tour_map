import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "~/styles/theme";
import createEmotionCache from "~/styles/createEmotionCache";
import "react-clock/dist/Clock.css";
import "react-calendar/dist/Calendar.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AuthCtxProvider } from "~/contexts/AuthCtx";
import { SnackbarProvider } from "notistack";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        {/* <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        /> */}
      </Head>

      <AuthCtxProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </AuthCtxProvider>
    </CacheProvider>
  );
}

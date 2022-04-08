import { ThemeProvider } from "@terra-dev/neumorphism-ui/themes/ThemeProvider";
import { HashConnect } from "hashconnect";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { getAnalytics, logEvent, setCurrentScreen } from "firebase/analytics";
import { firebase } from "../utils/firebase";
import "nprogress/nprogress.css";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import HashConnectProvider from "../context/HashConnectProvider";
import "../styles/globals.css";
import "../styles/_main.scss";
import { theme } from "../theme";
import TagManager from "react-gtm-module";
import { gtmId } from "@constants/constants";
import { config } from "config/config";

const hashConnect = new HashConnect(false);

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const router = useRouter();
  let firebaseApp = firebase;

  useEffect(() => {
    const analytics = getAnalytics();
    setCurrentScreen(analytics, router.pathname);
    logEvent(analytics, "screen_view");

    TagManager.initialize({ gtmId: gtmId, preview: config.network.name });
  }, [router.pathname]);

  return (
    <main id="main-root">
      <QueryClientProvider client={queryClient}>
        <HashConnectProvider hashConnect={hashConnect} debug>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </HashConnectProvider>
      </QueryClientProvider>
    </main>
  );
}

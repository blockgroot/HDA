import { ThemeProvider } from "@terra-dev/neumorphism-ui/themes/ThemeProvider";
import { HashConnect } from "hashconnect";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
// import "bootstrap/dist/css/bootstrap.css";
import "nprogress/nprogress.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import HashConnectProvider from "../context/HashConnectProvider";
import "../styles/globals.css";
import "../styles/_main.scss";
import { theme } from "../theme";

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
  // let firebaseApp = firebase;

  // useEffect(() => {
  //   const analytics = getAnalytics();
  //   setCurrentScreen(analytics, router.pathname);
  //   logEvent(analytics, "screen_view");

  //   TagManager.initialize({ gtmId: config.gtmId });
  // }, [router.pathname]);

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

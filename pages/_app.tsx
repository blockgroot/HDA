import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { getAnalytics, logEvent, setCurrentScreen } from "firebase/analytics";
import TagManager from "react-gtm-module";
import {
  NetworkInfo,
  StaticWalletProvider,
  WalletProvider,
} from "@terra-money/wallet-provider";
import { ThemeProvider } from "@terra-dev/neumorphism-ui/themes/ThemeProvider";
// import "bootstrap/dist/css/bootstrap.css";
import "nprogress/nprogress.css";
import "../styles/_main.scss";
import "../styles/globals.css";

import { theme } from "../theme";
import { firebase } from "../utils/firebase";
import { config } from "../config/config";
import reportWebVitals from "../utils/reportWebVitals";
import { AppProvider } from "../libs/appContext";
import { QueryClient, QueryClientProvider } from "react-query";

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: config.network,
};

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

    TagManager.initialize({ gtmId: config.gtmId });
  }, [router.pathname]);

  const main = (
    <main id="main-root">
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </AppProvider>
      </QueryClientProvider>
    </main>
  );

  reportWebVitals();

  return typeof window !== "undefined" ? (
    <WalletProvider
      defaultNetwork={config.network}
      walletConnectChainIds={walletConnectChainIds}
    >
      {main}
    </WalletProvider>
  ) : (
    <StaticWalletProvider defaultNetwork={config.network}>
      {main}
    </StaticWalletProvider>
  );
}

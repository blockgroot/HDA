import { ThemeProvider } from "@terra-dev/neumorphism-ui/themes/ThemeProvider";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { getAnalytics, logEvent, setCurrentScreen } from "firebase/analytics";
import { firebase } from "../utils/firebase";
import "nprogress/nprogress.css";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import HashConnectProvider from "../context/HashConnectProvider";
import "../styles/globals.css";
import "../styles/_main.scss";
import { theme } from "../theme";
import TagManager from "react-gtm-module";
import { gtmId } from "@constants/constants";
import { config } from "config/config";
import { HashConnectService } from "@services/hash-connect.service";
import TransactionFeeProvider from "context/TransactionFeeProvider";

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

  // Lazy load HashConnect only on client side to avoid SSR issues
  const [hashConnect, setHashConnect] = useState<HashConnectService | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);

    // Dynamically import and initialize HashConnect only on client
    // This prevents SSR issues where HashConnect tries to use browser APIs
    if (typeof window !== "undefined") {
      import("hashconnect")
        .then(({ HashConnect }) => {
          try {
            const hashConnectInstance = new HashConnectService(
              new HashConnect(false)
            );
            setHashConnect(hashConnectInstance);
          } catch (error) {
            console.error("Failed to create HashConnect instance:", error);
            // Page will still render without HashConnect
          }
        })
        .catch((error) => {
          console.error("Failed to load HashConnect module:", error);
          // Page will still render without HashConnect
        });
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      const analytics = getAnalytics();
      setCurrentScreen(analytics, router.pathname);
      logEvent(analytics, "screen_view");

      TagManager.initialize({ gtmId: gtmId, preview: config.network.name });
    }
  }, [router.pathname, isClient]);

  // Always render the page structure
  // HashConnectProvider will handle the case where hashConnect is not ready yet
  // Components using useHashConnect will use the default context values until HashConnect loads
  return (
    <main id="main-root">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          {isClient && hashConnect ? (
            <HashConnectProvider hashConnect={hashConnect} debug>
              <TransactionFeeProvider>
                <Component {...pageProps} />
              </TransactionFeeProvider>
            </HashConnectProvider>
          ) : (
            <Component {...pageProps} />
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </main>
  );
}

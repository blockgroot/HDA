/** @type {import('next').NextConfig} */

const path = require("path");

const withImages = require("next-images");
const withTM = require("next-transpile-modules", "hashconnect")([
  "@bladelabs/blade-web3.js",
  "hashconnect",
  "@hashgraph/hedera-wallet-connect",
  "@reown/appkit",
  "@reown/appkit-controllers",
  "@reown/walletkit",
  "@walletconnect/modal",
  "@walletconnect/utils",
]);

const { withSentryConfig } = require("@sentry/nextjs");

const isDev = process.env.NODE_ENV == "development";

const CURRENT_DAPP = "Hedera";
const getSupportedExtensions = (currentExtensions = []) => {
  return currentExtensions.reduce(
    (r, ext) => [...r, `.${CURRENT_DAPP}${ext}`, ext],
    []
  );
};

const allowedDomainsToConnect = [
  "https://staderverse.staderlabs.com",
  "https://o1175983.ingest.sentry.io",
  "https://firebase.googleapis.com",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "wss://*.bridge.walletconnect.org",
  "wss://relay.walletconnect.com",
  "https://registry.walletconnect.com",
  "https://explorer-api.walletconnect.com",
  "https://*.walletconnect.com",
  "https://api.wallet.coinbase.com",
  "wss://www.walletlink.org",
  "https://firebaseinstallations.googleapis.com",
  "https://api.thegraph.com",
  "https://api.coingecko.com/",
  "https://grpc-web.myhbarwallet.com/",
  "https://mainnet-public.mirrornode.hedera.com/",
  "wss://hashconnect.hashpack.app/",
  "https://grpc-web.testnet.myhbarwallet.com/",
  "https://testnet.mirrornode.hedera.com/",
  "https://time.google.com/",
  "http://time.google.com/",
  "https://developers.google.com/time/",
];

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self'${
    isDev ? " 'unsafe-eval'" : ""
  } 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com;
  frame-src 'self' https://verify.walletconnect.org https://*.walletconnect.org;
  connect-src 'self' ${allowedDomainsToConnect.join(" ")};
`;

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=()",
  },
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "require-corp",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
];

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(
  withTM(
    withImages(
      {
        poweredByHeader: false,

        productionBrowserSourceMaps: true,
        typescript: {
          // Ignore TypeScript errors in dependencies (like @noble/curves)
          ignoreBuildErrors: true,
        },
        webpack: (config) => {
          return {
            ...config,
            resolve: {
              ...config.resolve,
              extensions: getSupportedExtensions(config.resolve.extensions),
            },
          };
        },
        sassOptions: {
          includePaths: [path.join(__dirname, "styles")],

          prependData: `@import "./styles/_mixins.scss";`,
        },
        compiler: {
          // ssr and displayName are configured by default
          styledComponents: true,
        },
        async redirects() {
          return [
            {
              source: "/",
              destination: "/lt-pools",
              permanent: true,
            },
          ];
        },
        async headers() {
          return [
            {
              // Apply these headers to all routes.
              source: "/:path*",
              headers: securityHeaders,
            },
          ];
        },
      },
      sentryWebpackPluginOptions
    )
  )
);
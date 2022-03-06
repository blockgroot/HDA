/** @type {import('next').NextConfig} */

const path = require("path");

const withImages = require("next-images");
module.exports = withImages({
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/lt-pools",
        permanent: true,
      },
    ];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "./styles/_mixins.scss";`,
  },
});

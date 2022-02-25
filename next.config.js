/** @type {import('next').NextConfig} */

const path = require("path");

const withImages = require("next-images");
module.exports = withImages({
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/pools",
        permanent: true,
      },
    ];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "./styles/_mixins.scss";`,
  },
});

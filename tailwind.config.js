module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./stader-ui-lib/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#CE41BD",
          // "gradient-one": "#F04ADC",
          // "gradient-two": "rgba(240, 74, 220, .7)",
        },
        secondary: {
          DEFAULT: "#43b8d2",
        },
        dark: {
          50: "#1d1d1d",
          100: "#1E1E1E",
          200: "#2E2E2E",
          DEFAULT: "#010101",
          500: "#0A0A0A",
          600: "#111111",
        },
        light: {
          100: "#3E3E3E",
          800: "#8c8c8c",
          900: "#f9f9f9",
        },
      },
      borderRadius: {
        10: "0.625rem",
      },
      boxShadow: {
        "block-button": "2px 2px 8px rgba(1, 1, 1, 0.4)",
        "text-field": "1.5px 1.5px 3px rgba(30, 30, 30, 0.75)",
        box: "3px 3px 12px #010101",
      },
      fontSize: {
        h1: "2rem",
        h2: "1.5rem",
        h3: "1.125rem",
        body1: "1rem",
        body2: "0.875rem",
        body3: "0.75rem",
        caption1: "0.688rem",
        caption2: "0.625rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  important: true,
};

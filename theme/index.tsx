import { createTheme } from "@material-ui/core/styles";

import purple from "@material-ui/core/colors/purple";
// import green from '@material-ui/core/colors/green';

export const theme = {
  ...createTheme({
    typography: {
      fontFamily: "Montserrat",
      // fontFamily:
      // "Gotham, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontWeightLight: 200,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
    },

    palette: {
      // type: 'dark',
      background: {
        default: "#111111",
      },
      primary: {
        main: purple[500],
      },
      secondary: {
        light: "#f36ee3",
        main: "#F04ADC",
        dark: "#eb14d1",
        contrastText: "#FFFFFF",
      },
    },

    overrides: {
      MuiTouchRipple: {
        root: {
          opacity: 0.15,
        },
      },
    },
  }),

  intensity: 0.45,
  backgroundColor: "#111111",
  highlightBackgroundColor: "#292929",
  hoverBackgroundColor: "rgba(37, 117, 164, 0.05)",
  textColor: "#ffffff",
  dimTextColor: "rgba(255, 255, 255, 0.5)",

  button: {
    position: "absolute",
    width: 170,
    height: 40,
    left: 1076,
    top: 362,
    background:
      "linear-gradient(90deg, #F04ADC 0%, rgba(240, 74, 220, 0.7) 100%)",
    boxShadow: "2 2 4 #111111",
    borderRadius: 16,
    // textTransform: "none",
  },

  colors: {
    positive: "#F04ADC",
    negative: "#F04ADC",
    warning: "#F04ADC",
  },

  label: {
    backgroundColor: "#292929",
    textColor: "#ffffff",
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  actionButton: {
    backgroundColor: "#292929",
    backgroundHoverColor: "#404872",
    textColor: "#ffffff",
  },

  textButton: {
    textColor: "#ffffff",
  },

  borderButton: {
    borderColor: "#F04ADC",
    borderHoverColor: "#404872",
    textColor: "#ffffff",
  },

  selector: {
    backgroundColor: "#1b1e31",
    textColor: "#ffffff",
  },

  formControl: {
    labelColor: "rgba(255, 255, 255, 0.5)",
    labelFocusedColor: "#3867c4",
    labelErrorColor: "#F04ADC",
  },

  textInput: {
    backgroundColor: "#0B0B0B",
    textColor: "#ffffff",
  },

  table: {
    head: {
      textColor: "rgba(255, 255, 255, 0.5)",
    },
    body: {
      textColor: "#ffffff",
    },
  },

  slider: {
    thumb: {
      shadowColor: "rgba(0, 0, 0, 0.3)",
      thumbColor: "#ffffff",
    },
  },

  skeleton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    lightColor: "rgba(255, 255, 255, 0.2)",
  },

  dialog: {
    normal: {
      backgroundColor: "#111111",
      textColor: "#ffffff",
    },
    warning: {
      backgroundColor: "#1f2237",
      textColor: "#d69f34",
    },
    error: {
      backgroundColor: "#1f2237",
      textColor: "#F04ADC",
    },
    success: {
      backgroundColor: "#1f2237",
      textColor: "#3e9bba",
    },
  },

  tooltip: {
    normal: {
      backgroundColor: "#111111",
      textColor: "#ffffff",
    },
    warning: {
      backgroundColor: "#d69f34",
      textColor: "#ffffff",
    },
    error: {
      backgroundColor: "#ac2b45",
      textColor: "#ffffff",
    },
    success: {
      backgroundColor: "#3e9bba",
      textColor: "#ffffff",
    },
  },

  snackbar: {
    normal: {
      backgroundColor: "#363d5e",
      textColor: "#ffffff",
    },
    warning: {
      backgroundColor: "#d69f34",
      textColor: "#ffffff",
    },
    error: {
      backgroundColor: "#ac2b45",
      textColor: "#ffffff",
    },
    success: {
      backgroundColor: "#3e9bba",
      textColor: "#ffffff",
    },
  },

  section: {
    padding: 0,
  },
};

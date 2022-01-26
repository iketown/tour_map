import { createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";

// https://bareynol.github.io/mui-theme-creator/

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#607d8b",
    },
    secondary: {
      main: "#f57f17",
    },
  },
  typography: {
    fontFamily: "Open Sans",
  },
};

// Create a theme instance.
const theme = createTheme(themeOptions);

export default theme;

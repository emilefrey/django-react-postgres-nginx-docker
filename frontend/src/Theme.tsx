import { createMuiTheme } from '@material-ui/core/styles';

export const theme = (type: "dark" | "light") => createMuiTheme({
  palette: {
    type: type,
    primary: {
      main: '#1976d2',
      light: '#63a4ff',
      dark: '#004ba0'
    },
    secondary: {
      main: '#ffa000',
      light: '#ffd149',
      dark: '#c67100'
    },
  },
});
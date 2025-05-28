import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8C52FF', // 紫色
      light: '#A37FFF',
      dark: '#6A38DB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4E9EFF', // 藍色
      light: '#76B6FF',
      dark: '#2B76DB',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#f4f6fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#222222',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans TC',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.15)',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #8C52FF 30%, #4E9EFF 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #7B3FEE 30%, #337ADB 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
      },
    },
  },
});

export default theme; 


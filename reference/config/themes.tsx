import { createTheme } from '@mui/material/styles';


const CIMIGO_BLUE = '#1F61A9';
const CIMIGO_GREEN = '#A6CC17';

/**
 * Style overrides for Material UI components.
 *
 * @see https://mui.com/customization/theme-components/#global-style-overrides
 */
const defaultTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: [
      'Montserrat',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    tabular_nums: {
      fontVariantNumeric: 'tabular-nums'
    }
  },
  palette: {
    primary: {
      main: CIMIGO_BLUE,

    },
    secondary: {
      main: CIMIGO_GREEN,
    }
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          'img': {
            borderRadius: '4px'
          }
        }
      }
    },
    MuiTooltip: {
      defaultProps: {
        enterTouchDelay: 0
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none'
        },
      },
    }
  }
});

export { defaultTheme };

declare module '@mui/material/styles' {
  interface TypographyVariants {
    tabular_nums: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    tabular_nums: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    tabular_nums: true
  }
}
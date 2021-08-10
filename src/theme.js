import { red } from '@material-ui/core/colors';
// https://github.com/mui-org/material-ui/issues/13394
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';
import tailwindConfigModule from 'tailwind.config.js';
import resolveConfig from 'tailwindcss/resolveConfig';

const tailwindConfig = resolveConfig(tailwindConfigModule);

// A custom theme for this app
const theme = createMuiTheme({
  typography: {
    fontFamily: tailwindConfig.theme.fontFamily.body
  },
  palette: {
    primary: {
      main: tailwindConfig.theme.colors.primary.main
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  },
  overrides: {
    MuiInputBase: {
      root: {
        fontSize: '1.4rem',
        paddingLeft: '10px'
      }
    },
    MuiSelect: {
      root: {
        lineHeight: 'initial'
      },
      icon: {
        fill: tailwindConfig.theme.colors.primary.dark,
        fontSize: '2rem',
        right: '5px'
      }
    },
    MuiMenuItem: {
      root: {
        fontSize: '1.4rem'
      }
    },
    MuiTooltip: {
      tooltip: {
        fontSize: '1.4rem'
      }
    },
    PrivateSwitchBase: {
      root: {
        padding: 0
      }
    }
  }
});

export default theme;

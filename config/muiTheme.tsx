import { PropsWithChildren, useMemo } from 'react';
import { ThemeProvider, createTheme, useMediaQuery } from '@mui/material';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      secondary: {
        main: '#d01f10',
      },
      primary: {
        main: '#0041fa',
      },
    },
  });

export const CustomThemeProvider = ({ children }: PropsWithChildren) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () => getTheme(prefersDarkMode ? 'dark' : 'light'),
    [prefersDarkMode],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

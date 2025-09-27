'use client';

import { createTheme, ThemeProvider as ThemeProviderMaterial } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode, useMemo } from 'react';
import { useMediaQuery } from '@mui/material';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light', 
        //   mode: prefersDarkMode ? 'dark' : 'light', 
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProviderMaterial theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProviderMaterial>
  );
}
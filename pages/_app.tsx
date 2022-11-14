import '../styles/global.scss';

import type { AppProps } from 'next/app';
import { CssBaseline } from '@mui/material';
import { CustomThemeProvider } from '../config/muiTheme';
import Head from 'next/head';
import { QueryClientProvider } from '@tanstack/react-query';
import { SnackbarAlertProvider } from '../components/shared/SnackbarAlert';
import { reactQueryClient } from '../config/reactQuery';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <title>Collectionist</title>
      </Head>
      <QueryClientProvider client={reactQueryClient}>
        <SnackbarAlertProvider>
          <Component {...pageProps} />
        </SnackbarAlertProvider>
      </QueryClientProvider>
    </CustomThemeProvider>
  );
}

export default MyApp;

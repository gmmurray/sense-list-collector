import '../styles/global.scss';

import type { AppProps } from 'next/app';
import { CssBaseline } from '@mui/material';
import { CustomThemeProvider } from '../config/muiTheme';
import Head from 'next/head';
import Layout from '../lib/components/layout/Layout';
import { QueryClientProvider } from '@tanstack/react-query';
import { SnackbarAlertProvider } from '../lib/components/shared/SnackbarAlert';
import { reactQueryClient } from '../config/reactQuery';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>sense list collector</title>
      </Head>
      <Layout>
        <SnackbarAlertProvider>
          <QueryClientProvider client={reactQueryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </SnackbarAlertProvider>
      </Layout>
    </CustomThemeProvider>
  );
}

export default MyApp;

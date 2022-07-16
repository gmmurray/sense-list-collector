import '../styles/global.scss';

import type { AppProps } from 'next/app';
import { CssBaseline } from '@mui/material';
import Head from 'next/head';
import Layout from '../lib/components/layout/Layout';
import { SnackbarAlertProvider } from '../lib/components/shared/SnackbarAlert';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>sense list collector</title>
      </Head>
      <Layout>
        <SnackbarAlertProvider>
          <Component {...pageProps} />
        </SnackbarAlertProvider>
      </Layout>
      <CssBaseline />
    </>
  );
}

export default MyApp;

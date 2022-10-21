import { Box, Button, Typography } from '@mui/material';

import Link from 'next/link';
import type { NextPage } from 'next';
import { appRoutes } from '../lib/constants/routes';
import { firebaseAuth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import usePageTitle from '../lib/hooks/usePageTitle';
import { useRouter } from 'next/router';

const LandingPage: NextPage = () => {
  usePageTitle(appRoutes.landing.title);
  const [user] = useAuthState(firebaseAuth);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push(appRoutes.home.path);
    }
  }, [router, user]);

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        justifyContent: 'center',
        pl: '20vw',
        background:
          'linear-gradient(0deg, rgba(0,65,250,1) 0%, rgba(208,31,16,1) 100%)',
      }}
    >
      <Box>
        <Typography variant="h5">Share.</Typography>
        <Typography variant="h5">Manage.</Typography>
        <Typography variant="h5">Plan.</Typography>
        <Typography variant="h2">Collect.</Typography>
      </Box>
      <Box>
        <Link href={appRoutes.explore.path} passHref>
          <Button color="inherit">Explore</Button>
        </Link>
        <Link href={appRoutes.auth.path} passHref>
          <Button color="inherit">Login/Register</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default LandingPage;

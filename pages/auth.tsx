import { Button, Grid, Typography } from '@mui/material';
import firebaseApp, { firebaseAuth } from '../config/firebase';

import { Box } from '@mui/system';
import Link from 'next/link';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { appRoutes } from '../lib/constants/routes';
import { firebaseUiConfig } from '../config/firebaseUI';
import { getAuth } from 'firebase/auth';
import { getStringFromStringOrArray } from '../lib/helpers/stringHelpers';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import usePageTitle from '../lib/hooks/usePageTitle';
import { useRouter } from 'next/router';

const SignInPage = () => {
  usePageTitle(appRoutes.auth.title);
  const [user] = useAuthState(firebaseAuth);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      const redirectTo = router.query.redirectTo
        ? getStringFromStringOrArray(router.query.redirectTo)
        : appRoutes.home.path;
      router.push(redirectTo);
    }
  }, [router, user]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(0deg, rgba(208,31,16,1) 0%, rgba(0,65,250,1) 100%)',
        textAlign: 'center',
      }}
    >
      <Box>
        <Typography
          variant="h1"
          component="h1"
          color="white"
          textAlign="center"
        >
          Collectionist
        </Typography>
        <Typography
          variant="h6"
          component="h6"
          color="white"
          textAlign="center"
        >
          Click below to sign up / sign in
        </Typography>
        <StyledFirebaseAuth
          uiConfig={firebaseUiConfig}
          firebaseAuth={getAuth(firebaseApp)}
        />
        <Link href={appRoutes.landing.path} passHref>
          <Button color="inherit">Home</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default SignInPage;

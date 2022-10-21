import { Button, Grid, Typography } from '@mui/material';
import firebaseApp, { firebaseAuth } from '../config/firebase';

import { Box } from '@mui/system';
import Link from 'next/link';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { firebaseUiConfig } from '../config/firebaseUI';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SignInPage = () => {
  const [user] = useAuthState(firebaseAuth);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push('/home');
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
        <Link href="/" passHref>
          <Button color="inherit">Back</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default SignInPage;

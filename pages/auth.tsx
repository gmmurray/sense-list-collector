import { Grid, Typography } from '@mui/material';
import firebaseApp, { firebaseAuth } from '../config/firebase';

import { Box } from '@mui/system';
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
        background: 'radial-gradient(circle at top, #47afcf , #ac28c9)',
      }}
    >
      <Box>
        <Typography
          variant="h1"
          component="h1"
          color="white"
          textAlign="center"
        >
          Welcome
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          color="white"
          textAlign="center"
        >
          Sign in
        </Typography>
        <StyledFirebaseAuth
          uiConfig={firebaseUiConfig}
          firebaseAuth={getAuth(firebaseApp)}
        />
      </Box>
    </Box>
  );
};

export default SignInPage;

import type { NextPage } from 'next';
import { firebaseAuth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

const LandingPage: NextPage = () => {
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
        flex: 1,
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        justifyContent: 'center',
        pl: '20vw',
      }}
    >
      <Box>
        <Typography variant="h5">Share.</Typography>
        <Typography variant="h5">Manage.</Typography>
        <Typography variant="h5">Plan.</Typography>
        <Typography variant="h2">Collect.</Typography>
      </Box>
      <Box>
        <Link href="/explore" passHref>
          <Button>Explore</Button>
        </Link>
        <Link href="/auth" passHref>
          <Button>Login/Register</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default LandingPage;

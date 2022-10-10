import React, { useCallback } from 'react';

import { Box } from '@mui/system';
import { Container } from '@mui/material';
import CreateProfileDialog from './CreateProfileDialog';
import Footer from './Footer';
import Navbar from './Navbar';
import { firebaseAuth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useGetUserProfileQuery } from '../../lib/queries/users/userQueries';
import { useRouter } from 'next/router';

type LayoutProps = {} & React.PropsWithChildren;

const Layout = ({ children }: LayoutProps) => {
  const [user, userLoading] = useAuthState(firebaseAuth);
  const router = useRouter();
  const isAuthPage = router.pathname === '/auth';

  const { data: currentUserProfile } = useGetUserProfileQuery(user?.uid);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mb: 2 }}>
        {children}
      </Container>
      <Footer />
      <CreateProfileDialog />
    </Box>
  );
};

export default Layout;

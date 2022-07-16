import React, { useCallback } from 'react';

import { Box } from '@mui/system';
import { Container } from '@mui/material';
import Footer from './Footer';
import Navbar from './Navbar';
import { useRouter } from 'next/router';

type LayoutProps = {} & React.PropsWithChildren;

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const isAuthPage = router.pathname === '/auth';

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
    </Box>
  );
};

export default Layout;

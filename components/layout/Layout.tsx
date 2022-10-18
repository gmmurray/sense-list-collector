import { Box } from '@mui/system';
import { Container } from '@mui/material';
import CreateProfileDialog from './CreateProfileDialog';
import Footer from './Footer';
import Navbar from './Navbar';
import React from 'react';
import { useRouter } from 'next/router';

type LayoutProps = {} & React.PropsWithChildren;

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const noLayout = router.pathname === '/auth' || router.pathname === '/';

  if (noLayout) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container
        maxWidth="xl"
        sx={{
          pb: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          width: undefined,
        }}
      >
        {children}
      </Container>
      <Footer />
      <CreateProfileDialog />
    </Box>
  );
};

export default Layout;

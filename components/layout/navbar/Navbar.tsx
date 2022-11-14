import {
  AppBar,
  Box,
  Button,
  Container,
  Link as MUILink,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useCallback } from 'react';

import FullscreenNavbarMenu from './FullscreenNavbarMenu';
import Link from 'next/link';
import SmallscreenNavbarMenu from './SmallscreenNavbarMenu';
import UserNavbarMenu from './UserNavbarMenu';
import { appRoutes } from '../../../lib/constants/routes';
import { firebaseAuth } from '../../../config/firebase';
import { navbarLinks } from './navbarConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';

type Props = {
  isPublicPage?: boolean;
};

const Navbar = ({ isPublicPage }: Props) => {
  const [user, userLoading] = useAuthState(firebaseAuth);
  const router = useRouter();

  const availableLinks = navbarLinks.filter(link => {
    if (link.auth) {
      return !!user;
    } else {
      return true;
    }
  });

  const handleLoginClick = useCallback(() => {
    router.push(appRoutes.auth.query.redirectTo(router.asPath));
  }, [router]);

  return (
    <AppBar position="static" enableColorOnDark sx={{ mb: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link
            href={user ? appRoutes.home.path : appRoutes.landing.path}
            passHref
          >
            <Typography
              component={MUILink}
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: {
                  xs: 'none',
                  md: 'flex',
                },
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Collectionist
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <SmallscreenNavbarMenu links={availableLinks} />
          </Box>
          <Link href={user ? '/home' : '/'} passHref>
            <Typography
              component={MUILink}
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Collectionist
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <FullscreenNavbarMenu links={availableLinks} />
          </Box>
          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <UserNavbarMenu isPublicPage={isPublicPage} />
            </Box>
          )}
          {!userLoading && !user && (
            <Button sx={{ color: 'inherit' }} onClick={handleLoginClick}>
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

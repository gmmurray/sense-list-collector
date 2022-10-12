import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  Link as MUILink,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';

import Link from 'next/link';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { firebaseAuth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useGetUserProfileQuery } from '../../lib/queries/users/userQueries';
import { useRouter } from 'next/router';

const links: { name: string; to: string; auth: boolean }[] = [
  {
    name: 'Explore',
    to: '/explore',
    auth: false,
  },
  {
    name: 'Stash',
    to: '/stash',
    auth: true,
  },
  {
    name: 'Wish List',
    to: '/wish-list',
    auth: true,
  },
];

const Navbar = () => {
  const [user, userLoading] = useAuthState(firebaseAuth);
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { data: currentUserProfile } = useGetUserProfileQuery(user?.uid);

  const availableLinks = links.filter(link => {
    if (link.auth) {
      return !!user;
    } else {
      return true;
    }
  });

  const handleOpenNavMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!availableLinks.length) return;
      setAnchorElNav(event.currentTarget);
    },
    [availableLinks.length],
  );

  const handleOpenUserMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    },
    [],
  );

  const handleCloseNavMenu = useCallback(() => {
    setAnchorElNav(null);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const handleSettingsClick = useCallback(() => {
    router.push('/me');
    handleCloseUserMenu();
  }, [handleCloseUserMenu, router]);

  const handleLogoutClick = useCallback(() => {
    firebaseAuth.signOut();
    router.push('/auth');
  }, [router]);

  const handleProfileClick = useCallback(() => {
    if (!user) return;
    router.push(`/users/${user?.uid}`);
    handleCloseUserMenu();
  }, [handleCloseUserMenu, router, user]);

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" passHref>
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
              Collector
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={!!anchorElNav}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {availableLinks.map((link, key) => (
                <Link key={key} href={link.to} passHref>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{link.name}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Link href="/" passHref>
            <Typography
              component={MUILink}
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Collector
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {availableLinks.map((link, key) => (
              <Link key={key} href={link.to} passHref>
                <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                  {link.name}
                </Button>
              </Link>
            ))}
          </Box>
          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={currentUserProfile?.username ?? 'User'}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={currentUserProfile?.username ?? 'current user'}
                    src={currentUserProfile?.avatar}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText>Profile page</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleSettingsClick}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogoutClick}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
          {!userLoading && !user && (
            <Link href="/auth" passHref>
              <Button sx={{ color: 'inherit' }}>Login</Button>
            </Link>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

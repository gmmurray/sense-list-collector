import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Link as MUILink,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useCallback } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { firebaseAuth } from '../../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const links: { name: string; to: string; auth: boolean }[] = [
  {
    name: 'Wish List',
    to: '/wish-list',
    auth: true,
  },
  {
    name: 'Stash',
    to: '/stash',
    auth: true,
  },
];

const Navbar = () => {
  const [user, userLoading] = useAuthState(firebaseAuth);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const availableLinks = links.filter(link => {
    if (link.auth) {
      return !!user;
    } else {
      return true;
    }
  });

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!availableLinks.length) return;
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoutClick = useCallback(() => firebaseAuth.signOut(), []);

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
              <Tooltip title="User settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircleIcon sx={{ color: 'white' }} />
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
                <MenuItem onClick={handleLogoutClick}>
                  <Typography textAlign="center">Logout</Typography>
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

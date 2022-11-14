import {
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import React, { Fragment, useCallback, useState } from 'react';

import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { appRoutes } from '../../../lib/constants/routes';
import { firebaseAuth } from '../../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useGetUserProfileQuery } from '../../../lib/queries/users/userQueries';
import { useRouter } from 'next/router';

type Props = {
  isPublicPage?: boolean;
};
const UserNavbarMenu = ({ isPublicPage }: Props) => {
  const router = useRouter();
  const [user] = useAuthState(firebaseAuth);
  const { data: currentUserProfile } = useGetUserProfileQuery(user?.uid);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleOpenMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      setMenuAnchor(event.currentTarget),
    [],
  );

  const handleCloseMenu = useCallback(() => setMenuAnchor(null), []);

  const handleCloseUserMenu = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const handleSettingsClick = useCallback(() => {
    router.push(appRoutes.me.path);
    handleCloseUserMenu();
  }, [handleCloseUserMenu, router]);

  const handleLogoutClick = useCallback(() => {
    firebaseAuth.signOut();
    if (isPublicPage && typeof window !== 'undefined') {
      window.location.reload();
    }
  }, [isPublicPage]);

  const handleLoginClick = useCallback(() => {
    router.push(appRoutes.auth.query.redirectTo(router.asPath));
  }, [router]);

  const handleProfileClick = useCallback(() => {
    if (!user) return;
    router.push(appRoutes.users.view.path(user.uid));
    handleCloseUserMenu();
  }, [handleCloseUserMenu, router, user]);

  return (
    <Fragment>
      <Tooltip title={currentUserProfile?.username ?? 'User'}>
        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
          <Avatar
            alt={currentUserProfile?.username ?? 'current user'}
            src={currentUserProfile?.avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
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
    </Fragment>
  );
};

export default UserNavbarMenu;

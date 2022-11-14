import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React, { Fragment, useCallback, useState } from 'react';

import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { linkType } from './navbarConfig';
import { useRouter } from 'next/router';

type SmallscreenNavbarMenuProps = {
  links: linkType[];
};

const SmallscreenNavbarMenu = ({ links }: SmallscreenNavbarMenuProps) => {
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleOpenMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      setMenuAnchor(event.currentTarget),
    [],
  );

  const handleCloseMenu = useCallback(() => setMenuAnchor(null), []);

  return (
    <Fragment>
      <IconButton size="large" onClick={handleOpenMenu} color="inherit">
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={!!menuAnchor}
        onClose={handleCloseMenu}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {links.map((link, key) => {
          const props = {
            link,
            key,
            pathname: router.pathname,
            onClose: handleCloseMenu,
          };
          return link.children ? (
            <OptionWithChildren {...props} />
          ) : (
            <Option {...props} />
          );
        })}
      </Menu>
    </Fragment>
  );
};

const Option = ({
  pathname,
  link,
  onClose,
}: {
  pathname: string;
  link: SmallscreenNavbarMenuProps['links'][number];
  onClose: () => any;
}) => (
  <Link href={link.to} passHref>
    <MenuItem onClick={onClose} selected={link.active(pathname)}>
      <Typography textAlign="center">{link.name}</Typography>
    </MenuItem>
  </Link>
);

const OptionWithChildren = ({
  pathname,
  link,
}: {
  pathname: string;
  link: SmallscreenNavbarMenuProps['links'][number];
  onClose: () => any;
}) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleOpenMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) =>
      setMenuAnchor(event.currentTarget),
    [],
  );

  const handleCloseMenu = useCallback(() => setMenuAnchor(null), []);

  return (
    <Fragment>
      <MenuItem onClick={handleOpenMenu} selected={link.active(pathname)}>
        <Typography textAlign="center">{link.name}</Typography>
      </MenuItem>
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        {(link.children ?? []).map((childLink, key) => (
          <Link href={childLink.to} passHref key={key}>
            <MenuItem
              onClick={handleCloseMenu}
              selected={childLink.active(pathname)}
            >
              <Typography textAlign="center">{childLink.name}</Typography>
            </MenuItem>
          </Link>
        ))}
      </Menu>
    </Fragment>
  );
};

export default SmallscreenNavbarMenu;

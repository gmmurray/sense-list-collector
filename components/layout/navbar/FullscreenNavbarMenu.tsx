import { Button, Menu, MenuItem, Typography } from '@mui/material';
import React, { Fragment, useCallback, useState } from 'react';

import Link from 'next/link';
import { linkType } from './navbarConfig';
import { useRouter } from 'next/router';

type FullscreenNavbarMenuProps = {
  links: linkType[];
};

const FullscreenNavbarMenu = ({ links }: FullscreenNavbarMenuProps) => {
  const { pathname } = useRouter();
  return (
    <Fragment>
      {links.map((link, key) => {
        const props = { link, key, pathname };
        return link.children ? (
          <OptionWithChildren {...props} />
        ) : (
          <Option {...props} />
        );
      })}
    </Fragment>
  );
};

const Option = ({
  pathname,
  link,
}: {
  pathname: string;
  link: FullscreenNavbarMenuProps['links'][number];
}) => (
  <Link href={link.to} passHref>
    <Button
      sx={{
        my: 2,
        display: 'block',
        color: link.active(pathname) ? 'white' : 'grey.400',
        [':hover']: {
          color: 'white',
        },
      }}
    >
      {link.name}
    </Button>
  </Link>
);

const OptionWithChildren = ({
  pathname,
  link,
}: {
  pathname: string;
  link: FullscreenNavbarMenuProps['links'][number];
}) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleOpenMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      setMenuAnchor(event.currentTarget),
    [],
  );

  const handleCloseMenu = useCallback(() => setMenuAnchor(null), []);

  return (
    <Fragment>
      <Button
        sx={{
          my: 2,
          display: 'block',
          color: link.active(pathname) ? 'white' : 'grey.400',
          [':hover']: {
            color: 'white',
          },
        }}
        onClick={handleOpenMenu}
      >
        {link.name}
      </Button>
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
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

export default FullscreenNavbarMenu;

import {
  Box,
  Button,
  Grid,
  IconButton,
  Link as MUILink,
  Typography,
  useTheme,
} from '@mui/material';

import Image from 'next/image';
import React from 'react';

const Footer = () => {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 2,
        mt: 'auto',
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.palette.primary.light
            : theme.palette.grey[900],
      }}
    >
      <Grid container>
        <Grid item xs={12} textAlign="center">
          <Button
            href="https://sense-list.com"
            target="_blank"
            color="inherit"
            size="small"
          >
            Sense List app suite
          </Button>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <IconButton href="https://sense-list.com" target="_blank">
            <Image
              src="/sense_list_logo.png"
              height="35"
              width="35"
              alt="Sense List logo"
            />
          </IconButton>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Typography variant="caption" color="white">
            {`Copyright© ${new Date().getFullYear()} `}
            <MUILink
              color="inherit"
              href="https://github.com/gmmurray"
              target="_blank"
              rel="noreferrer"
            >
              Greg Murray
            </MUILink>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;

import {
  Box,
  Container,
  Grid,
  Link as MUILink,
  Stack,
  Typography,
} from '@mui/material';

import { Copyright } from '@mui/icons-material';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme =>
          theme.palette.mode === 'light'
            ? theme.palette.primary.light
            : theme.palette.primary.dark,
      }}
    >
      <Container maxWidth="sm">
        <Grid container mb={2} textAlign="center">
          <Grid item xs={12} md={4} px={2}>
            <Stack>
              <Link href="/" passHref>
                <Typography
                  variant="subtitle2"
                  color="white"
                  component="a"
                  gutterBottom
                  sx={{ textDecoration: 'none' }}
                >
                  SenseList Collector
                </Typography>
              </Link>
              <Typography variant="body2" sx={{ color: 'grey.A200' }}>
                The best way to keep track of your ever-growing collection.
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            px={2}
            sx={{
              borderLeft: {
                xs: 'none',
                md: '1px solid white',
              },
            }}
          >
            <Stack>
              <Typography
                variant="subtitle2"
                color="white"
                component="a"
                gutterBottom
              >
                Other sites
              </Typography>
              <MUILink
                href="https://books.senselist.gmurray.dev"
                variant="body2"
                target="_blank"
                rel="noreferrer"
                sx={{ color: 'grey.A200', textDecoration: 'none' }}
              >
                Books
              </MUILink>
              <MUILink
                href="https://recipes.gmurray.dev/"
                variant="body2"
                target="_blank"
                rel="noreferrer"
                sx={{ color: 'grey.A200', textDecoration: 'none' }}
              >
                Recipes
              </MUILink>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            px={2}
            sx={{
              borderLeft: {
                xs: 'none',
                md: '1px solid white',
              },
            }}
          >
            <Stack>
              <Typography
                variant="subtitle2"
                color="white"
                component="a"
                gutterBottom
              >
                About the creator
              </Typography>
              <MUILink
                href="https://gregmurray.org"
                variant="body2"
                target="_blank"
                rel="noreferrer"
                sx={{ color: 'grey.A200', textDecoration: 'none' }}
              >
                Personal website
              </MUILink>
              <MUILink
                href="https://github.com/gmmurray"
                variant="body2"
                target="_blank"
                rel="noreferrer"
                sx={{ color: 'grey.A200', textDecoration: 'none' }}
              >
                GitHub
              </MUILink>
              <MUILink
                href="https://gregmurray.org/blog"
                variant="body2"
                target="_blank"
                rel="noreferrer"
                sx={{ color: 'grey.A200', textDecoration: 'none' }}
              >
                Blog
              </MUILink>
            </Stack>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} textAlign="center">
            <Typography variant="caption" color="white">
              {`Copyright© ${new Date().getFullYear()} `}
              <MUILink
                color="inherit"
                href="https://gregmurray.org"
                target="_blank"
                rel="noreferrer"
              >
                Greg Murray
              </MUILink>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;

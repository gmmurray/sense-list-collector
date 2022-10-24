/* eslint-disable @next/next/no-img-element */

import { Button, Container, Grid, Paper, Typography } from '@mui/material';

import { Box } from '@mui/system';
import Link from 'next/link';
import React from 'react';
import { appRoutes } from '../lib/constants/routes';
import usePageTitle from '../lib/hooks/usePageTitle';
import withLayout from '../lib/hoc/layout/withLayout';
import withUser from '../lib/hoc/withUser';

const HomePage = () => {
  usePageTitle(appRoutes.home.title);
  return (
    <Container
      sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      maxWidth="xl"
    >
      <Grid container spacing={4} direction="column" sx={{ flex: 1, mb: 2 }}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'end',
            }}
          >
            <img
              src="/containers_stock.jpg"
              alt="Containers image"
              style={{ maxHeight: '50vh', width: '100%', borderRadius: 4 }}
            />
            <Typography
              variant="h2"
              sx={{ position: 'absolute', color: 'white', pl: 1 }}
            >
              Collectionist
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'stretch',
            width: '100%',
          }}
        >
          <Box width="100%">
            <Grid
              container
              spacing={4}
              sx={{ height: '100%', alignItems: 'stretch' }}
            >
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    height: '100%',
                    p: 2,
                  }}
                  elevation={4}
                >
                  <Link href={appRoutes.explore.path} passHref>
                    <Button sx={{ px: 0, textTransform: 'none' }}>
                      <Typography variant="h4">Explore</Typography>
                    </Button>
                  </Link>
                  <Typography variant="h5">
                    Check out some of the collections people are currently
                    working on.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    height: '100%',
                    p: 2,
                  }}
                  elevation={4}
                >
                  <Link href={appRoutes.stash.path} passHref>
                    <Button sx={{ px: 0, textTransform: 'none' }}>
                      <Typography variant="h4">Stash</Typography>
                    </Button>
                  </Link>
                  <Typography variant="h5">
                    The items that represent your epic collections.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    height: '100%',
                    p: 2,
                  }}
                  elevation={4}
                >
                  <Link href={appRoutes.wishList.path} passHref>
                    <Button sx={{ px: 0, textTransform: 'none' }}>
                      <Typography variant="h4">Wish list</Typography>
                    </Button>
                  </Link>
                  <Typography variant="h5">
                    Keep track of that last item you needed for your latest
                    collection.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default withLayout(withUser(HomePage), { useCustomContainer: true });

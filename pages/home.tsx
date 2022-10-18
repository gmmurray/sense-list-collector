/* eslint-disable @next/next/no-img-element */

import { Button, Grid, Paper, Typography } from '@mui/material';

import { Box } from '@mui/system';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import containersImage from '../public/containers_stock.jpg';
import withUser from '../lib/hoc/withUser';

const HomePage = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Box
          sx={{
            height: '100%',
            minHeight: '30vh',
            maxHeight: '50vh',
            display: 'flex',
            alignItems: 'end',
          }}
        >
          <img
            src="/containers_stock.jpg"
            alt="Containers image"
            style={{ maxHeight: '50vh', width: '100%' }}
          />
          <Typography variant="h2" sx={{ position: 'absolute' }}>
            Collectionist
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4} sx={{ height: '100%' }}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{ height: '100%', p: 2, display: 'flex', alignItems: 'end' }}
            >
              <Box>
                <Box>
                  <Link href="/explore" passHref>
                    <Button sx={{ px: 0, textTransform: 'none' }}>
                      <Typography variant="h4">Explore</Typography>
                    </Button>
                  </Link>
                </Box>
                <Box>
                  <Typography variant="body1">
                    Check out some of the latest collections people are working
                    on.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{ height: '100%', p: 2, display: 'flex', alignItems: 'end' }}
            >
              <Box>
                <Box>
                  <Link href="/stash" passHref>
                    <Button sx={{ px: 0, textTransform: 'none' }}>
                      <Typography variant="h4">Stash</Typography>
                    </Button>
                  </Link>
                </Box>
                <Box>
                  <Typography variant="body1">
                    The items that represent your epic collections.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{ height: '100%', p: 2, display: 'flex', alignItems: 'end' }}
            >
              <Box>
                <Link href="/wish-list" passHref>
                  <Button sx={{ px: 0, textTransform: 'none' }}>
                    <Typography variant="h4">Wish list</Typography>
                  </Button>
                </Link>
                <Typography variant="body1">
                  What is that last item you need for your latest collection?
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withUser(HomePage);

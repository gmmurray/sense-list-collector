import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import {
  ICollectionWithId,
  getLatestCollectionsMock,
} from '../../../entities/collection';
import React, { useEffect, useState } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box } from '@mui/system';
import CollectionsList from '../../../lib/components/collections/CollectionsList';
import GridViewIcon from '@mui/icons-material/GridView';
import GridViewSelector from '../../../lib/components/shared/GridViewSelector';
import Link from 'next/link';
import ViewListIcon from '@mui/icons-material/ViewList';

const ViewCollections = () => {
  const [collections, setCollections] = useState<ICollectionWithId[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    const loadCollections = async () => {
      setCollectionsLoading(true);
      const result = await getLatestCollectionsMock(10);
      setCollectionsLoading(false);
      setCollections(result);
    };
    loadCollections();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Link href="/stash" passHref>
          <Button startIcon={<ArrowBackIcon />}>Back to stash</Button>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2" component="h1">
          My collections
        </Typography>
      </Grid>
      <Grid item xs={12} display="flex">
        <Box ml="auto">
          <GridViewSelector
            isGridView={isGridView}
            onGridViewChange={setIsGridView}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <CollectionsList
          isGridView={isGridView}
          collections={collections}
          loading={collectionsLoading}
        />
      </Grid>
    </Grid>
  );
};

export default ViewCollections;

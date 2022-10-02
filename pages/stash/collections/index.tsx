import { Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import withUser, { useUserContext } from '../../../lib/hoc/withUser';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box } from '@mui/system';
import CollectionsList from '../../../lib/components/collections/CollectionsList';
import GridViewSelector from '../../../lib/components/shared/GridViewSelector';
import Link from 'next/link';
import { useGetLatestUserCollectionsQuery } from '../../../lib/queries/collections/collectionQueries';

const ViewCollections = () => {
  const { documentUser } = useUserContext();
  const { data: collections = [], isLoading: collectionsLoading } =
    useGetLatestUserCollectionsQuery(documentUser?.userId);
  const [isGridView, setIsGridView] = useState(true);

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
        <Box>
          <Link href="/stash/collections/new" passHref>
            <Button startIcon={<AddIcon />}>New</Button>
          </Link>
        </Box>
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

export default withUser(ViewCollections);

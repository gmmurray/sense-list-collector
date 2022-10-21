import { Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box } from '@mui/system';
import CollectionsList from '../../../components/collections/CollectionsList';
import GridViewSelector from '../../../components/shared/GridViewSelector';
import Link from 'next/link';
import { appRoutes } from '../../../lib/constants/routes';
import { useGetLatestUserCollectionsQuery } from '../../../lib/queries/collections/collectionQueries';
import usePageTitle from '../../../lib/hooks/usePageTitle';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';
import withLayout from '../../../lib/hoc/layout/withLayout';
import withUser from '../../../lib/hoc/withUser';

const ViewCollections = () => {
  usePageTitle(appRoutes.stash.collections.title);
  const { documentUser } = useUserContext();
  const { data: collections = [], isLoading: collectionsLoading } =
    useGetLatestUserCollectionsQuery(documentUser?.userId);
  const [isGridView, setIsGridView] = useState(
    !documentUser?.experience?.preferTables,
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Link href={appRoutes.stash.path} passHref>
          <Button startIcon={<ArrowBackIcon />} color="secondary">
            Back to stash
          </Button>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2" component="h1">
          My collections
        </Typography>
      </Grid>
      <Grid item xs={12} display="flex">
        <Box>
          <Link href={appRoutes.stash.collections.new.path()} passHref>
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

export default withLayout(withUser(ViewCollections));

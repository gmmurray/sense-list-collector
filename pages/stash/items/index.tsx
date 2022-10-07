import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GridViewSelector from '../../../lib/components/shared/GridViewSelector';
import ItemsList from '../../../lib/components/items/ItemsList';
import Link from 'next/link';
import { useGetLatestUserItemsQuery } from '../../../lib/queries/items/itemQueries';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';
import withUser from '../../../lib/hoc/withUser';

const ViewItems = () => {
  const { authUser } = useUserContext();
  const { data: items, isLoading: itemsLoading } = useGetLatestUserItemsQuery(
    authUser?.uid,
  );

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
          My items
        </Typography>
      </Grid>
      <Grid item xs={12} display="flex">
        <Box>
          <Link href="/stash/items/new" passHref>
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
        <ItemsList
          isGridView={isGridView}
          items={items ?? []}
          loading={itemsLoading}
        />
      </Grid>
    </Grid>
  );
};

export default withUser(ViewItems);

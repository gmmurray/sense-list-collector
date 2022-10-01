import { Box, Button, Grid, Typography } from '@mui/material';
import { IItemWithId, getLatestItems } from '../../../entities/item';
import React, { useEffect, useState } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GridViewSelector from '../../../lib/components/shared/GridViewSelector';
import ItemsList from '../../../lib/components/items/ItemsList';
import Link from 'next/link';
import withUser from '../../../lib/hoc/withUser';

const ViewItems = () => {
  const [items, setItems] = useState<IItemWithId[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setItemsLoading(true);
      const result = await getLatestItems(10);
      setItemsLoading(false);
      setItems(result);
    };
    loadItems();
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
          My items
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
        <ItemsList
          isGridView={isGridView}
          items={items}
          loading={itemsLoading}
        />
      </Grid>
    </Grid>
  );
};

export default withUser(ViewItems);

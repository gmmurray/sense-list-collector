import CenteredLoadingIndicator from '../shared/CenteredLoadingIndicator';
import CenteredMessage from '../shared/CenteredMessage';
import { Grid } from '@mui/material';
import { IItemWithId } from '../../../entities/item';
import ItemsListItem from './ItemsListItem';
import ItemsTable from './ItemsTable';
import React from 'react';

type ItemsListProps = {
  items: IItemWithId[];
  loading: boolean;
  isGridView?: boolean;
};

const ItemsList = ({ items, loading, isGridView = true }: ItemsListProps) => {
  if (loading) {
    return <CenteredLoadingIndicator />;
  } else if (!items || items.length === 0) {
    return <CenteredMessage message="No items found" />;
  }

  if (!isGridView) {
    return <ItemsTable items={items} />;
  }

  return (
    <Grid container spacing={2}>
      {items.map(item => (
        <Grid key={item.id} item xs={12} md={6} lg={4}>
          <ItemsListItem item={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ItemsList;

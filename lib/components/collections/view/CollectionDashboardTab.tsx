import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from '@mui/material';
import React, { Fragment } from 'react';

import CenteredLoadingIndicator from '../../shared/CenteredLoadingIndicator';
import Link from 'next/link';
import { sortByTimestamp } from '../../../helpers/timestampSort';
import { useCollectionTabContext } from './CollectionTabContext';

const DASHBOARD_ITEMS_COUNT = 3;

const CollectionDashboardTab = () => {
  const { collection, items, itemsLoading } = useCollectionTabContext();

  if (!collection) return null;

  const showItems = collection.itemIds.length > 0;

  const newItems = sortByTimestamp(items, 'created', 'desc').slice(
    0,
    DASHBOARD_ITEMS_COUNT,
  );

  const favoriteItemLookup = new Map(
    collection.favoriteItemIds.map(id => [id, id]),
  );
  const favoriteItems = items
    .filter(item => favoriteItemLookup.has(item.id))
    .slice(0, DASHBOARD_ITEMS_COUNT);

  return (
    <Grid container spacing={2}>
      {showItems && (
        <Fragment>
          <Grid item xs={12}>
            {!itemsLoading && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h4">New items</Typography>
                <List>
                  {newItems.map(item => (
                    <ListItem key={item.id} disablePadding>
                      <Link href={`/stash/items/${item.id}`} passHref>
                        <ListItemButton>{item.name}</ListItemButton>
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
            {itemsLoading && (
              <CenteredLoadingIndicator height="20vh" size={40} />
            )}
          </Grid>
          {!itemsLoading && favoriteItems.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h4">Favorite items</Typography>
                <List>
                  {favoriteItems.map(item => (
                    <ListItem key={item.id} disablePadding>
                      <Link href={`/stash/items/${item.id}`} passHref>
                        <ListItemButton>{item.name}</ListItemButton>
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Fragment>
      )}
      <Grid item xs={6}>
        <Paper
          sx={{
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5">Item count</Typography>
          <Typography variant="subtitle1" sx={{ mt: 'auto' }}>
            {collection.itemIds.length}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper
          sx={{
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5">Last updated</Typography>
          <Typography variant="subtitle1" sx={{ mt: 'auto' }}>
            {new Date(collection.updatedAt).toLocaleDateString()}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CollectionDashboardTab;

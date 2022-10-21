import {
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Link as MUILink,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';

import CollectionsList from '../../components/collections/CollectionsList';
import ItemsList from '../../components/items/ItemsList';
import Link from 'next/link';
import { appRoutes } from '../../lib/constants/routes';
import { useGetLatestUserCollectionsQuery } from '../../lib/queries/collections/collectionQueries';
import { useGetLatestUserItemsQuery } from '../../lib/queries/items/itemQueries';
import usePageTitle from '../../lib/hooks/usePageTitle';
import { useUserContext } from '../../lib/hoc/withUser/userContext';
import withLayout from '../../lib/hoc/layout/withLayout';
import withUser from '../../lib/hoc/withUser';

const Stash = () => {
  usePageTitle(appRoutes.stash.title);
  const { authUser } = useUserContext();
  const [currentView, setCurrentView] = useState<
    'all' | 'collections' | 'items'
  >('all');

  const { data: collections, isLoading: collectionsLoading } =
    useGetLatestUserCollectionsQuery(authUser?.uid, 3);
  const { data: items, isLoading: itemsLoading } = useGetLatestUserItemsQuery(
    authUser?.uid,
    4,
  );

  const handleViewChange = useCallback(
    (newView: typeof currentView) => () => setCurrentView(newView),
    [],
  );

  const showCollections =
    currentView === 'all' || currentView === 'collections';
  const showItems = currentView === 'all' || currentView === 'items';

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2" component="h1">
          My stash
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ButtonGroup disableElevation color="secondary">
          <Button
            variant={currentView === 'all' ? 'contained' : 'outlined'}
            onClick={handleViewChange('all')}
          >
            All
          </Button>
          <Button
            variant={currentView === 'collections' ? 'contained' : 'outlined'}
            onClick={handleViewChange('collections')}
          >
            Collections
          </Button>
          <Button
            variant={currentView === 'items' ? 'contained' : 'outlined'}
            onClick={handleViewChange('items')}
          >
            Items
          </Button>
        </ButtonGroup>
      </Grid>
      {showCollections && (
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2">
              Collections
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Link href={appRoutes.stash.collections.path()} passHref>
              <MUILink underline="hover">View all</MUILink>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <CollectionsList
              collections={collections ?? []}
              loading={collectionsLoading}
            />
          </Grid>
        </Grid>
      )}
      {currentView === 'all' && (
        <Grid item xs={12}>
          <Divider />
        </Grid>
      )}
      {showItems && (
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2">
              Items
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Link href={appRoutes.stash.items.path()} passHref>
              <MUILink underline="hover">View all</MUILink>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <ItemsList items={items ?? []} loading={itemsLoading} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default withLayout(withUser(Stash));

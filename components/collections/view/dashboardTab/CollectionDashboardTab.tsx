import React, { Fragment, useState } from 'react';

import DashboardCommentsCard from './DashboardCommentsCard';
import DashboardDefaultCards from './DashboardDefaultCards';
import DashboardItemsCards from './DashboardItemsCards';
import { Grid } from '@mui/material';
import ViewCollectionItemDialog from '../ViewCollectionItemDialog';
import { sortByTimestamp } from '../../../../lib/helpers/timestampSort';
import { useCollectionTabContext } from '../CollectionTabContext';

const DASHBOARD_ITEMS_COUNT = 3;

const CollectionDashboardTab = () => {
  const { collection, items = [], itemsLoading } = useCollectionTabContext();

  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const selectedItem = items.filter(i => i.id === selectedId)[0];

  return (
    <Fragment>
      <Grid container spacing={2}>
        {showItems && (
          <DashboardItemsCards
            newItems={newItems}
            favoriteItems={favoriteItems}
            loading={itemsLoading}
            onSelect={setSelectedId}
          />
        )}
        <DashboardDefaultCards collection={collection} />
        <DashboardCommentsCard collection={collection} />
      </Grid>
      <ViewCollectionItemDialog
        collection={collection}
        item={selectedItem}
        onClose={() => setSelectedId(null)}
      />
    </Fragment>
  );
};

export default CollectionDashboardTab;

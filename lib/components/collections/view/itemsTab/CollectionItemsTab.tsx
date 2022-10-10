/* eslint-disable @next/next/no-img-element */

import { Box, Grid } from '@mui/material';
import React, { Fragment, useCallback, useState } from 'react';

import CenteredLoadingIndicator from '../../../shared/CenteredLoadingIndicator';
import CenteredMessage from '../../../shared/CenteredMessage';
import GalleryViewSelector from '../../../shared/GalleryViewSelector';
import ItemsTabGallery from './ItemsTabGallery';
import ItemsTabTable from './ItemsTabTable';
import ViewCollectionItemDialog from '../ViewCollectionItemDialog';
import { useCollectionTabContext } from '../CollectionTabContext';
import { useUserContext } from '../../../../hoc/withUser/userContext';

const CollectionItemsTab = () => {
  const { documentUser } = useUserContext();
  const { collection, items, itemsLoading } = useCollectionTabContext();
  const [galleryView, setGalleryView] = useState(
    !documentUser?.experience?.preferTables,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleItemClick = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  if (itemsLoading) {
    return <CenteredLoadingIndicator />;
  } else if (items.length === 0) {
    return <CenteredMessage message="No items in this collection" />;
  }

  const selectedItem = items.filter(i => i.id === selectedId)[0];

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} display="flex" style={{ paddingTop: 0 }}>
          <Box ml="auto">
            <GalleryViewSelector
              isGalleryView={galleryView}
              onGalleryViewChange={setGalleryView}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          {galleryView ? (
            <ItemsTabGallery items={items} onItemClick={handleItemClick} />
          ) : (
            <ItemsTabTable
              collection={collection}
              items={items}
              onItemClick={handleItemClick}
            />
          )}
        </Grid>
      </Grid>
      <ViewCollectionItemDialog
        collection={collection}
        item={selectedItem}
        onClose={() => setSelectedId(null)}
      />
    </Fragment>
  );
};

export default CollectionItemsTab;

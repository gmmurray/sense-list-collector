/* eslint-disable @next/next/no-img-element */

import { Box, Grid } from '@mui/material';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import CenteredLoadingIndicator from '../../../shared/CenteredLoadingIndicator';
import CenteredMessage from '../../../shared/CenteredMessage';
import { FullscreenDialog } from '../../../shared/FullscreenDialog';
import GalleryViewSelector from '../../../shared/GalleryViewSelector';
import { IItemWithId } from '../../../../../entities/item';
import ItemsTabGallery from './ItemsTabGallery';
import ItemsTabTable from './ItemsTabTable';
import ItemsTabViewItem from './ItemsTabViewItem';
import { useCollectionTabContext } from '../CollectionTabContext';

const CollectionItemsTab = () => {
  const { items, itemsLoading, isOwner } = useCollectionTabContext();
  const [galleryView, setGalleryView] = useState(true);
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
            <ItemsTabTable items={items} onItemClick={handleItemClick} />
          )}
        </Grid>
      </Grid>
      <FullscreenDialog
        title="View"
        open={!!selectedItem}
        onClose={() => setSelectedId(null)}
        transition="default"
        responsive
      >
        {selectedItem && (
          <ItemsTabViewItem item={selectedItem} isOwner={isOwner} />
        )}
      </FullscreenDialog>
    </Fragment>
  );
};

export default CollectionItemsTab;
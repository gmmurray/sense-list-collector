/* eslint-disable @next/next/no-img-element */

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';

import FavoritedCollectionItemButton from './FavoritedCollectionItemButton';
import { FullscreenDialog } from '../../shared/FullscreenDialog';
import { ICollectionWithId } from '../../../entities/collection';
import { IItemWithId } from '../../../entities/item';
import { getDateStringFromFirestoreTimestamp } from '../../../lib/helpers/firestoreHelpers';
import { getItemPrimaryImageUrl } from '../../../lib/constants/images';
import { useSnackbarAlert } from '../../shared/SnackbarAlert';
import { useUpdateCollectionFavoriteItemsMutation } from '../../../lib/queries/collections/collectionMutations';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';

type ItemDetailKey =
  | 'name'
  | 'price'
  | 'description'
  | 'category'
  | 'rating'
  | 'createdAt'
  | 'updatedAt';

type ItemDetailProps = {
  item: IItemWithId;
  dataKey: ItemDetailKey;
  title: string;
};

const ItemDetail = ({ item, dataKey, title }: ItemDetailProps) => {
  const data = item[dataKey];

  if (!data) return null;

  let content;
  if (typeof data === 'string') {
    content = data;
  } else if (typeof data === 'number') {
    content = data.toLocaleString();
  } else {
    content = getDateStringFromFirestoreTimestamp(data);
  }

  return (
    <Grid item>
      <Stack>
        <Typography variant="overline">{title}</Typography>
        <Typography variant="body1">{content}</Typography>
      </Stack>
    </Grid>
  );
};

type ViewCollectionItemDialogProps = {
  collection?: ICollectionWithId;
  item?: IItemWithId;
  onClose: () => any;
};

const ViewCollectionItemDialog = ({
  collection,
  item,
  onClose,
}: ViewCollectionItemDialogProps) => {
  const snackbar = useSnackbarAlert();
  const { authUser } = useUserContext();

  const updateCollectionFavoriteItemsMutation =
    useUpdateCollectionFavoriteItemsMutation();

  const isOwner = collection && authUser && collection.userId === authUser.uid;

  const handleUpdateFavorite = useCallback(async () => {
    if (!isOwner || !collection || !item) return;
    const isAdditive = !collection.favoriteItemIds.includes(item.id);

    try {
      await updateCollectionFavoriteItemsMutation.mutateAsync({
        itemIds: [item.id],
        isAdditive,
        collectionId: collection.id,
      });
    } catch (error) {
      console.log('Error updating collection favorite items');
      snackbar.send('Error updating favorites', 'error');
    }
  }, [
    collection,
    isOwner,
    item,
    snackbar,
    updateCollectionFavoriteItemsMutation,
  ]);

  return (
    <FullscreenDialog
      title="View"
      open={!!item}
      onClose={onClose}
      transition="default"
      responsive
    >
      {!!item && (
        <Grid container spacing={2}>
          <Grid item xs={12} display="flex" alignItems="center">
            <Box>
              <Typography variant="h4">{item.name}</Typography>
            </Box>
            {isOwner && (collection?.itemIds ?? []).includes(item.id) && (
              <Box>
                <FavoritedCollectionItemButton
                  onClick={handleUpdateFavorite}
                  selected={(collection?.favoriteItemIds ?? []).includes(
                    item.id,
                  )}
                  disabled={updateCollectionFavoriteItemsMutation.isLoading}
                />
              </Box>
            )}
            {isOwner && (
              <Box ml="auto">
                <Button
                  href={`${window.location.origin}/stash/items/${item.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Edit
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} textAlign="center" sx={{ minHeight: '200px' }}>
            <img
              src={getItemPrimaryImageUrl(item)}
              style={{ objectFit: 'contain', maxWidth: '100%' }}
              alt={item.name}
            />
          </Grid>
          <ItemDetail item={item} dataKey="category" title="Category" />
          <ItemDetail item={item} dataKey="description" title="Description" />
          <ItemDetail item={item} dataKey="rating" title="Rating" />
          <ItemDetail item={item} dataKey="createdAt" title="Created" />
          <ItemDetail item={item} dataKey="updatedAt" title="Updated" />
        </Grid>
      )}
    </FullscreenDialog>
  );
};

export default ViewCollectionItemDialog;

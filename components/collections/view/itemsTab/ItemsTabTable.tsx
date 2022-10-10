import {
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useCallback } from 'react';

import FavoritedCollectionItemButton from '../FavoritedCollectionItemButton';
import { ICollectionWithId } from '../../../../entities/collection';
import { IItemWithId } from '../../../../entities/item';
import { getDateStringFromFirestoreTimestamp } from '../../../../lib/helpers/firestoreHelpers';
import { useSnackbarAlert } from '../../../shared/SnackbarAlert';
import { useUpdateCollectionFavoriteItemsMutation } from '../../../../lib/queries/collections/collectionMutations';
import { useUserContext } from '../../../../lib/hoc/withUser/userContext';

type ItemsTabTableProps = {
  collection?: ICollectionWithId;
  items: IItemWithId[];
  onItemClick: (id: string) => void;
};

const ItemsTabTable = ({
  collection,
  items,
  onItemClick,
}: ItemsTabTableProps) => {
  const { authUser } = useUserContext();
  const snackbar = useSnackbarAlert();

  const updateCollectionFavoriteItemsMutation =
    useUpdateCollectionFavoriteItemsMutation();

  const isOwner = collection && authUser && collection.userId === authUser.uid;

  const handleUpdateFavorite = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
      event.stopPropagation();

      if (!isOwner || !collection) return;

      const isAdditive = !collection.favoriteItemIds.includes(itemId);

      try {
        await updateCollectionFavoriteItemsMutation.mutateAsync({
          itemIds: [itemId],
          isAdditive,
          collectionId: collection.id,
        });
      } catch (error) {
        console.log('Error updating collection favorite items');
        snackbar.send('Error updating favorites', 'error');
      }
    },
    [collection, isOwner, snackbar, updateCollectionFavoriteItemsMutation],
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {isOwner && <TableCell size="small" padding="checkbox"></TableCell>}
            <TableCell>Name</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Rating</TableCell>
            <TableCell align="right">Updated</TableCell>
            <TableCell align="right">Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(item => (
            <Fade key={item.id} in timeout={500}>
              <TableRow
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                }}
                onClick={() => onItemClick(item.id)}
              >
                {isOwner && (
                  <TableCell size="small" padding="checkbox">
                    <FavoritedCollectionItemButton
                      selected={!!collection?.favoriteItemIds.includes(item.id)}
                      onClick={e => handleUpdateFavorite(e, item.id)}
                    />
                  </TableCell>
                )}
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.category ?? '--'}</TableCell>
                <TableCell align="right">{item.rating ?? '--'}</TableCell>
                <TableCell align="right">
                  {getDateStringFromFirestoreTimestamp(item.updatedAt)}
                </TableCell>
                <TableCell align="right">
                  {getDateStringFromFirestoreTimestamp(item.createdAt)}
                </TableCell>
              </TableRow>
            </Fade>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemsTabTable;

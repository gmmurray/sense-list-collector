import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CenteredLoadingIndicator from '../../shared/CenteredLoadingIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import { IItemWithId } from '../../../../entities/item';
import { useGetLatestUserItemsQuery } from '../../../queries/items/itemQueries';
import { useSnackbarAlert } from '../../shared/SnackbarAlert';
import { useUpdateUserCategoryMutation } from '../../../queries/users/userMutations';
import { useUserContext } from '../../../hoc/withUser/userContext';

const ItemCategoryPreferences = () => {
  const snackbar = useSnackbarAlert();
  const { documentUser } = useUserContext();

  const { data: items = [], isLoading: itemsLoading } =
    useGetLatestUserItemsQuery(documentUser?.userId);

  const updateMutation = useUpdateUserCategoryMutation();

  const [newCategory, setNewCategory] = useState('');

  const handleNewCategoryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setNewCategory(event.target.value),
    [],
  );

  const handleUpdate = useCallback(
    async (deleteCategory?: string) => {
      if (!documentUser) return;

      if (!deleteCategory && (!newCategory || newCategory === '')) return;

      try {
        if (deleteCategory) {
          const canContinue = confirm(
            `Are you sure you want to delete the "${deleteCategory}" category? Existing items will remain unchanged and need their categories changed manually.`,
          );
          if (!canContinue) return;
        }

        await updateMutation.mutateAsync({
          category: deleteCategory ?? newCategory,
          isAdditive: !deleteCategory,
          userId: documentUser.userId,
        });
        setNewCategory('');
      } catch (error) {
        console.log(error);
        snackbar.send('Error updating categories', 'error');
      }
    },
    [documentUser, newCategory, snackbar, updateMutation],
  );

  const itemsByCategory = useMemo(() => {
    if (!documentUser?.categories.length || !items.length) return null;
    const map = new Map<string, IItemWithId[]>(
      documentUser.categories.map(c => [c, []]),
    );
    items.forEach(item => {
      if (item.category && map.has(item.category))
        map.set(item.category, [...(map.get(item.category) ?? []), item]);
    });
    return map;
  }, [documentUser, items]);

  if (!documentUser) return null;
  else if (itemsLoading) return <CenteredLoadingIndicator />;

  return (
    <List
      subheader={
        <TextField
          variant="standard"
          fullWidth
          label="Add"
          value={newCategory}
          onChange={handleNewCategoryChange}
          InputProps={{
            endAdornment: (
              <IconButton
                disabled={updateMutation.isLoading}
                onClick={() => handleUpdate()}
              >
                <AddIcon />
              </IconButton>
            ),
          }}
        />
      }
    >
      {documentUser.categories.map(c => (
        <ListItem key={c}>
          <ListItemText
            primary={c}
            secondary={`${itemsByCategory?.get(c)?.length ?? 0} item(s)`}
          />
          <ListItemSecondaryAction>
            <IconButton
              disabled={updateMutation.isLoading}
              onClick={() => handleUpdate(c)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default ItemCategoryPreferences;

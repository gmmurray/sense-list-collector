import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Fade,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CenteredLoadingIndicator from '../../../shared/CenteredLoadingIndicator';
import CenteredMessage from '../../../shared/CenteredMessage';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { FullscreenDialog } from '../../../shared/FullscreenDialog';
import Fuse from 'fuse.js';
import { ICollectionWithId } from '../../../../../entities/collection';
import { IItemWithId } from '../../../../../entities/item';
import InfoIcon from '@mui/icons-material/Info';
import { LoadingButton } from '@mui/lab';
import RemoveIcon from '@mui/icons-material/Remove';
import ViewCollectionItemDialog from '../ViewCollectionItemDialog';
import debounce from 'lodash.debounce';
import { getItemPrimaryImageUrl } from '../../../../constants/images';

type ManageCollectionItemsListProps = {
  collection: ICollectionWithId;
  collectionItems: IItemWithId[];
  userItems: IItemWithId[];
  itemsLoading: boolean;
  saveLoading: boolean;
  onSave: (itemIds: string[], isAdditive: boolean) => Promise<void>;
};

let searchEngine: Fuse<IItemWithId>;

const ManageCollectionItemsList = ({
  collection,
  collectionItems,
  userItems,
  itemsLoading,
  saveLoading,
  onSave,
}: ManageCollectionItemsListProps) => {
  const [isAddMode, setIsAddMode] = useState(false);
  const [visibleItems, setVisibleItems] = useState(collectionItems);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [viewItemId, setViewItemId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const listItems = isAddMode ? userItems : collectionItems;

  useEffect(() => {
    setVisibleItems(listItems);
    searchEngine = new Fuse(listItems, {
      keys: ['name', 'category'],
    });
  }, [collectionItems, isAddMode, listItems, userItems]);

  const handleIsAddModeToggle = useCallback(() => {
    setIsAddMode(state => !state);
    setSelectedItemIds([]);
    setSearchValue('');
  }, []);

  const handleSaveChanges = useCallback(async () => {
    try {
      await onSave(selectedItemIds, isAddMode);
      setSelectedItemIds([]);
      setIsAddMode(false);
      setSearchValue('');
    } catch (error) {
      return;
    }
  }, [isAddMode, onSave, selectedItemIds]);

  const handleItemSelect = useCallback(
    (itemId: string, isAdditive: boolean) =>
      setSelectedItemIds(state => {
        return isAdditive
          ? [...state, itemId]
          : state.filter(id => id !== itemId);
      }),
    [],
  );

  const handleSelectAllClick = useCallback(() => {
    const items =
      visibleItems.length !== selectedItemIds.length
        ? visibleItems.map(item => item.id)
        : [];

    setSelectedItemIds(items);
  }, [selectedItemIds.length, visibleItems]);

  const handleSearchValueChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
      setSearchValue(value),
    [],
  );

  useEffect(() => {
    const search = debounce(() => {
      const items =
        searchValue === ''
          ? listItems
          : searchEngine.search(searchValue).map(item => item.item);

      setVisibleItems(items);
    }, 200);
    search();
  }, [listItems, searchValue]);

  if (itemsLoading) {
    return <CenteredLoadingIndicator />;
  }

  const viewItem = listItems.filter(item => item.id === viewItemId)[0];

  const renderContent = () => {
    if (collectionItems.length === 0 && !isAddMode) {
      return <CenteredMessage message="No items added" />;
    } else if (userItems.length === 0 && isAddMode) {
      return <CenteredMessage message="No more items to add" />;
    }

    return (
      <List sx={{ mb: 5 }}>
        <ListItem disablePadding>
          <ListItemIcon sx={{ px: 2 }} onClick={handleSelectAllClick}>
            <Checkbox
              checked={
                selectedItemIds.length === visibleItems.length &&
                visibleItems.length !== 0
              }
              edge="start"
            />
          </ListItemIcon>
          <ListItemText
            primary={isAddMode ? 'Other items' : 'Current items'}
            secondary={`${selectedItemIds.length}/${listItems.length} item(s) selected`}
            secondaryTypographyProps={{
              sx: {
                ml: 'auto',
              },
            }}
            sx={{ display: 'flex' }}
          />
        </ListItem>
        {visibleItems.length === 0 && (
          <CenteredMessage message="Could not find item" />
        )}
        {visibleItems.map((item, index) => {
          const isSelected = selectedItemIds.includes(item.id);
          return (
            <Fragment key={item.id}>
              <Fade in timeout={500}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton onClick={() => setViewItemId(item.id)}>
                      <InfoIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => handleItemSelect(item.id, !isSelected)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isSelected}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemAvatar>
                      <Avatar
                        alt={item.name}
                        src={getItemPrimaryImageUrl(item)}
                        sx={{ height: 56 }}
                        imgProps={{ sx: { objectFit: 'contain' } }}
                        variant="square"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={item.description}
                      secondaryTypographyProps={{
                        sx: {
                          overflow: 'hidden',
                          maxWidth: '90%',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Fade>
              {index < visibleItems.length - 1 && <Divider />}
            </Fragment>
          );
        })}
      </List>
    );
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} display="flex">
        <Button
          variant="outlined"
          onClick={handleIsAddModeToggle}
          startIcon={isAddMode ? <RemoveIcon /> : <AddIcon />}
        >
          {isAddMode ? 'Remove' : 'Add'}
        </Button>
        <TextField
          placeholder="Search"
          fullWidth
          variant="standard"
          sx={{ ml: 2 }}
          value={searchValue}
          onChange={handleSearchValueChange}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setSearchValue('')}
                disabled={searchValue === ''}
              >
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} display="flex">
        <Button
          variant="contained"
          color="error"
          onClick={() => setSelectedItemIds([])}
          startIcon={<ClearIcon />}
          disabled={selectedItemIds.length === 0}
          sx={{
            ml: {
              xs: undefined,
              md: 'auto',
            },
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          loading={saveLoading}
          variant="contained"
          onClick={handleSaveChanges}
          startIcon={<CheckIcon />}
          disabled={selectedItemIds.length === 0}
          sx={{
            ml: {
              xs: 'auto',
              md: 2,
            },
          }}
        >
          {`${isAddMode ? 'Add' : 'Remove'}`}
        </LoadingButton>
      </Grid>
      <Grid item xs={12}>
        {renderContent()}
      </Grid>
      <FullscreenDialog
        title="View"
        open={!!viewItemId}
        onClose={() => setViewItemId(null)}
        transition="default"
        responsive
      >
        {viewItemId && (
          <ViewCollectionItemDialog
            collection={collection}
            item={viewItem}
            isOwner
          />
        )}
      </FullscreenDialog>
    </Grid>
  );
};

export default ManageCollectionItemsList;

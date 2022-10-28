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
  Tooltip,
} from '@mui/material';
import React, {
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ButtonGroup from '@mui/material/ButtonGroup';
import CenteredLoadingIndicator from '../../../shared/CenteredLoadingIndicator';
import CenteredMessage from '../../../shared/CenteredMessage';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Fuse from 'fuse.js';
import { ICollectionWithId } from '../../../../entities/collection';
import { IItemWithId } from '../../../../entities/item';
import InfoIcon from '@mui/icons-material/Info';
import { LoadingButton } from '@mui/lab';
import RemoveIcon from '@mui/icons-material/Remove';
import SortIcon from '@mui/icons-material/Sort';
import ViewCollectionItemDialog from '../ViewCollectionItemDialog';
import debounce from 'lodash.debounce';
import { getItemPrimaryImageUrl } from '../../../../lib/constants/images';
import { useUpdateCollectionItemOrderMutation } from '../../../../lib/queries/collections/collectionMutations';

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
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [visibleItems, setVisibleItems] = useState(collectionItems);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [viewItemId, setViewItemId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const updateCollectionItemOrderMutation =
    useUpdateCollectionItemOrderMutation();

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

  const handleReset = useCallback(() => {
    setVisibleItems(collectionItems);
    setSelectedItemIds([]);
    setViewItemId(null);
    setSearchValue('');
  }, [collectionItems]);

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

  const handleToggleReorderMode = useCallback(() => {
    const newValue = !isReorderMode;

    if (newValue) {
      handleReset();
    }

    setIsReorderMode(newValue);
  }, [handleReset, isReorderMode]);

  const handleReorderClick = useCallback(
    async (itemId: string, direction: 'up' | 'down') => {
      if (!collection) return;

      await updateCollectionItemOrderMutation.mutateAsync({
        currList: collection.itemIds,
        itemId,
        direction,
        collectionId: collection.id,
      });
    },
    [collection, updateCollectionItemOrderMutation],
  );

  if (itemsLoading) {
    return <CenteredLoadingIndicator />;
  }

  const viewItem = listItems.filter(item => item.id === viewItemId)[0];
  const positionMap = new Map(
    (collection.itemIds ?? []).map((id, index) => [id, index]),
  );

  const renderContent = () => {
    if (collectionItems.length === 0 && !isAddMode) {
      return <CenteredMessage message="No items added" />;
    } else if (userItems.length === 0 && isAddMode) {
      return <CenteredMessage message="No more items to add" />;
    }

    return (
      <List sx={{ mb: 5 }}>
        {!isReorderMode && (
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
        )}
        {visibleItems.length === 0 && (
          <CenteredMessage message="Could not find item" />
        )}
        {visibleItems
          .sort((a, b) =>
            (positionMap.get(a.id) ?? 0) > (positionMap.get(b.id) ?? 0)
              ? 1
              : -1,
          )
          .map((item, index) => {
            const isSelected = selectedItemIds.includes(item.id);
            const position = positionMap.get(item.id);

            const InnerContentWrapper = ({ children }: PropsWithChildren) => {
              if (isReorderMode) {
                return <Fragment>{children}</Fragment>;
              }

              return (
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
                  {children}
                </ListItemButton>
              );
            };

            return (
              <Fragment key={item.id}>
                <Fade in timeout={500}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      isReorderMode ? (
                        <ButtonGroup
                          size="small"
                          color="inherit"
                          variant="contained"
                          disableElevation
                          sx={{ color: 'black' }}
                        >
                          <Button
                            disabled={
                              position === 0 ||
                              updateCollectionItemOrderMutation.isLoading
                            }
                            onClick={() => handleReorderClick(item.id, 'up')}
                          >
                            <ArrowDropUpIcon />
                          </Button>
                          <Button
                            disabled={
                              position === collectionItems.length - 1 ||
                              updateCollectionItemOrderMutation.isLoading
                            }
                            onClick={() => handleReorderClick(item.id, 'down')}
                          >
                            <ArrowDropDownIcon />
                          </Button>
                        </ButtonGroup>
                      ) : (
                        <IconButton onClick={() => setViewItemId(item.id)}>
                          <InfoIcon />
                        </IconButton>
                      )
                    }
                    disablePadding
                  >
                    <InnerContentWrapper>
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
                            maxWidth: isReorderMode ? '60%' : '90%',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                        }}
                      />
                    </InnerContentWrapper>
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
        <Tooltip title={isReorderMode ? 'Stop reordering' : 'Reorder items'}>
          <IconButton color="inherit" onClick={handleToggleReorderMode}>
            {isReorderMode ? <ClearIcon /> : <SortIcon />}
          </IconButton>
        </Tooltip>
        {!isReorderMode && (
          <Fragment>
            <Tooltip title={isAddMode ? 'Remove items' : 'Add items'}>
              <IconButton onClick={handleIsAddModeToggle}>
                {isAddMode ? (
                  <RemoveIcon color="secondary" />
                ) : (
                  <AddIcon color="secondary" />
                )}
              </IconButton>
            </Tooltip>
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
          </Fragment>
        )}
      </Grid>
      <Grid item xs={12} md={6} display="flex">
        {!isReorderMode && (
          <Fragment>
            <Button
              size="small"
              color="warning"
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
              size="small"
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
          </Fragment>
        )}
      </Grid>
      <Grid item xs={12} style={{ paddingTop: isReorderMode ? 0 : undefined }}>
        {renderContent()}
      </Grid>
      <ViewCollectionItemDialog
        collection={collection}
        item={viewItem}
        onClose={() => setViewItemId(null)}
      />
    </Grid>
  );
};

export default ManageCollectionItemsList;

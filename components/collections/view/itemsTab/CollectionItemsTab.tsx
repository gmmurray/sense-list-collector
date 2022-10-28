/* eslint-disable @next/next/no-img-element */

import { Box, Button, ButtonGroup, Grid, TextField } from '@mui/material';
import {
  CollectionItemsListState,
  collectionItemsListSortOptions,
  useCollectionItemsList,
} from './useCollectionItemsList';
import React, { Fragment, useCallback, useState } from 'react';

import CenteredLoadingIndicator from '../../../shared/CenteredLoadingIndicator';
import CenteredMessage from '../../../shared/CenteredMessage';
import ClearIcon from '@mui/icons-material/Clear';
import GalleryViewSelector from '../../../shared/GalleryViewSelector';
import ItemsTabGallery from './ItemsTabGallery';
import ItemsTabTable from './ItemsTabTable';
import ListMenuOptions from '../../../shared/ListMenuOptions';
import SortIcon from '@mui/icons-material/Sort';
import ViewCollectionItemDialog from '../ViewCollectionItemDialog';
import { uniqueElements } from '../../../../lib/helpers/arrayHelpers';
import { useCollectionTabContext } from '../CollectionTabContext';
import { useUserContext } from '../../../../lib/hoc/withUser/userContext';

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

  const {
    result,
    sort,
    filter,
    onSearch,
    onSort,
    onFilter,
    onReset,
    searchValue,
  } = useCollectionItemsList(items, collection?.itemIds ?? []);

  const [anchors, setAnchors] = useState<{
    sort: HTMLButtonElement | null;
    category: HTMLButtonElement | null;
  }>({
    sort: null,
    category: null,
  });

  const handleAnchorToggle = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement> | null,
      key: keyof typeof anchors,
    ) => {
      setAnchors(state => ({ ...state, [key]: e?.currentTarget ?? null }));
    },
    [],
  );

  const handleSortChange = useCallback(
    (newSortBy: CollectionItemsListState['sortBy']) => {
      let newSortOrder: CollectionItemsListState['sortOrder'];
      if (sort.by === newSortBy) {
        newSortOrder = sort.order === 'asc' ? 'desc' : 'asc';
      } else {
        newSortOrder = 'desc';
      }

      onSort(newSortBy, newSortOrder);
      handleAnchorToggle(null, 'sort');
    },
    [handleAnchorToggle, onSort, sort.by, sort.order],
  );

  const handleCategoryFilterChange = useCallback(
    (value?: string) => {
      const newValue = value === filter['category'] ? undefined : value;
      onFilter('category', newValue);
      handleAnchorToggle(null, 'category');
    },
    [filter, handleAnchorToggle, onFilter],
  );

  const itemCategories = uniqueElements(
    (items ?? []).map(item => item.category),
  ) as string[];

  if (itemsLoading) {
    return <CenteredLoadingIndicator />;
  } else if ((items ?? []).length === 0) {
    return <CenteredMessage message="No items in this collection" />;
  }

  const selectedItem = items.filter(i => i.id === selectedId)[0];

  let itemCategoryMenuOptions = itemCategories.map(c => ({
    title: c,
    value: c,
    selected: filter.category === c,
  }));

  if (items.some(item => !item.category)) {
    itemCategoryMenuOptions = [
      {
        title: 'no category',
        value: 'none',
        selected: filter.category === 'none',
      },
      ...itemCategoryMenuOptions,
    ];
  }

  return (
    <Fragment>
      <Grid container spacing={2}>
        {itemCategories.length > 1 && (
          <Grid item>
            <Button
              variant={filter.category ? 'contained' : 'outlined'}
              disableElevation
              size="small"
              onClick={e => handleAnchorToggle(e, 'category')}
            >
              Category
            </Button>
          </Grid>
        )}
        <Grid item>
          <Button
            variant="outlined"
            endIcon={<SortIcon />}
            size="small"
            onClick={e => handleAnchorToggle(e, 'sort')}
          >
            Sort
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            endIcon={<ClearIcon />}
            size="small"
            onClick={onReset}
          >
            Reset
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Search"
            variant="standard"
            fullWidth
            value={searchValue ?? ''}
            onChange={e => onSearch(e.currentTarget.value)}
          />
        </Grid>
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
            <ItemsTabGallery items={result} onItemClick={handleItemClick} />
          ) : (
            <ItemsTabTable
              collection={collection}
              items={result}
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
      <ListMenuOptions
        anchor={anchors.category}
        onClose={() => handleAnchorToggle(null, 'category')}
        onOptionClick={handleCategoryFilterChange}
        options={itemCategoryMenuOptions}
      />
      <ListMenuOptions
        anchor={anchors.sort}
        onClose={() => handleAnchorToggle(null, 'sort')}
        onOptionClick={handleSortChange}
        options={collectionItemsListSortOptions.map(option => ({
          title: option,
          value: option,
          selected: sort.by === option,
        }))}
        showSortIcon
        sortDir={sort.order}
      />
    </Fragment>
  );
};

export default CollectionItemsTab;

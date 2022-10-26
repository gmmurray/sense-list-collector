import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Menu,
  TextField,
  Typography,
} from '@mui/material';
import {
  ItemsListState,
  itemsListSortOptions,
  useItemsList,
} from '../../../components/items/useItemsList';
import React, { useCallback, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import GridViewSelector from '../../../components/shared/GridViewSelector';
import ItemsList from '../../../components/items/ItemsList';
import Link from 'next/link';
import ListMenuOptions from '../../../components/shared/ListMenuOptions';
import SortIcon from '@mui/icons-material/Sort';
import { appRoutes } from '../../../lib/constants/routes';
import { uniqueElements } from '../../../lib/helpers/arrayHelpers';
import { useGetLatestUserItemsQuery } from '../../../lib/queries/items/itemQueries';
import usePageTitle from '../../../lib/hooks/usePageTitle';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';
import withLayout from '../../../lib/hoc/layout/withLayout';
import withUser from '../../../lib/hoc/withUser';

const ViewItems = () => {
  usePageTitle(appRoutes.stash.items.title);
  const { documentUser } = useUserContext();
  const { data: items, isLoading: itemsLoading } = useGetLatestUserItemsQuery(
    documentUser?.userId,
  );

  const [isGridView, setIsGridView] = useState(
    !documentUser?.experience?.preferTables,
  );

  const {
    result,
    sort,
    filter,
    onSearch,
    onSort,
    onFilter,
    onReset,
    searchValue,
  } = useItemsList(items);

  const [anchors, setAnchors] = useState<{
    sort: HTMLButtonElement | null;
    category: HTMLButtonElement | null;
    hasCollections: HTMLButtonElement | null;
  }>({
    sort: null,
    category: null,
    hasCollections: null,
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
    (newSortBy: ItemsListState['sortBy']) => {
      let newSortOrder: ItemsListState['sortOrder'];
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

  const handleCollectionsFilterChange = useCallback(
    (value?: boolean) => {
      const newValue = value === filter['hasCollections'] ? undefined : value;
      onFilter('hasCollections', newValue);
      handleAnchorToggle(null, 'hasCollections');
    },
    [filter, handleAnchorToggle, onFilter],
  );

  const itemCategories = uniqueElements(
    (items ?? []).map(item => item.category),
  ) as string[];

  let itemCategoryMenuOptions = itemCategories.map(c => ({
    title: c,
    value: c,
    selected: filter.category === c,
  }));

  if ((items ?? []).some(item => !item.category)) {
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Link href={appRoutes.stash.path} passHref>
          <Button startIcon={<ArrowBackIcon />} color="secondary">
            Back to stash
          </Button>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2" component="h1">
          My items
        </Typography>
      </Grid>
      <Grid item>
        <Link href={appRoutes.stash.items.new.path()} passHref>
          <Button variant="outlined" startIcon={<AddIcon />} size="small">
            New
          </Button>
        </Link>
      </Grid>
      <Grid item>
        <ButtonGroup>
          {itemCategories.length > 1 && (
            <Button
              variant={filter.category ? 'contained' : 'outlined'}
              disableElevation
              size="small"
              onClick={e => handleAnchorToggle(e, 'category')}
            >
              Category
            </Button>
          )}
          <Button
            variant={
              filter.hasCollections !== undefined ? 'contained' : 'outlined'
            }
            disableElevation
            size="small"
            onClick={e => handleAnchorToggle(e, 'hasCollections')}
          >
            Collections
          </Button>
        </ButtonGroup>
      </Grid>
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
      <Grid item xs={12} display="flex">
        <Box ml="auto">
          <GridViewSelector
            isGridView={isGridView}
            onGridViewChange={setIsGridView}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ItemsList
          isGridView={isGridView}
          items={result ?? []}
          loading={itemsLoading}
        />
      </Grid>
      <ListMenuOptions
        anchor={anchors.category}
        onClose={() => handleAnchorToggle(null, 'category')}
        onOptionClick={handleCategoryFilterChange}
        options={itemCategoryMenuOptions}
      />
      <ListMenuOptions
        anchor={anchors.hasCollections}
        onClose={() => handleAnchorToggle(null, 'hasCollections')}
        onOptionClick={handleCollectionsFilterChange}
        options={[
          {
            title: '1+ collections',
            value: true,
            selected: filter.hasCollections === true,
          },
          {
            title: '0 collections',
            value: false,
            selected: filter.hasCollections === false,
          },
        ]}
      />
      <ListMenuOptions
        anchor={anchors.sort}
        onClose={() => handleAnchorToggle(null, 'sort')}
        onOptionClick={handleSortChange}
        options={itemsListSortOptions.map(option => ({
          title: option,
          value: option,
          selected: sort.by === option,
        }))}
        showSortIcon
        sortDir={sort.order}
      />
    </Grid>
  );
};

export default withLayout(withUser(ViewItems));

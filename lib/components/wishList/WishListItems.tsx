import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  TextField,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import {
  WishListItemsState,
  wishListItemSortOptions,
} from '../../types/wishListComponents';

import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box } from '@mui/system';
import CenteredMessage from '../shared/CenteredMessage';
import { FullscreenDialog } from '../shared/FullscreenDialog';
import GridViewIcon from '@mui/icons-material/GridView';
import SortIcon from '@mui/icons-material/Sort';
import ViewListIcon from '@mui/icons-material/ViewList';
import WishListItem from './WishListItem';
import WishListItemForm from './WishListItemForm';
import WishListItemTable from './WishListItemTable';
import { useUserContext } from '../../hoc/withUser';
import { useWishListItemsContext } from './WishListItemsContext';

const WishListItems = () => {
  const itemsContext = useWishListItemsContext();
  const userContext = useUserContext();
  const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [priorityAnchorEl, setPriorityAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [priceAnchorEl, setPriceAnchorEl] = useState<HTMLElement | null>(null);
  const [gridView, setGridView] = useState(true);

  const {
    onFilterChange,
    onReset,
    onSortChange,
    onEditorToggle,
    onSearch,
    searchValue,
    itemsLoading,
    filteredItems,
    editorOpen,
    editorInitialValue,
    listOptions: {
      sortBy,
      sortOrder,
      categoryFilter,
      priceFilter,
      priorityFilter,
    },
  } = itemsContext;

  const { documentUser } = userContext;

  const userCategories = documentUser?.categories ?? [];

  const handleSortOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) =>
      setSortAnchorEl(e.currentTarget),
    [],
  );

  const handleSortClose = useCallback(() => setSortAnchorEl(null), []);

  const handleCategoryFilterOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) =>
      setCategoryAnchorEl(e.currentTarget),
    [],
  );
  const handleCategoryFilterClose = useCallback(
    () => setCategoryAnchorEl(null),
    [],
  );
  const handleCategoryFilterChange = useCallback(
    (value: string) => {
      if (!onFilterChange) return;

      const newValue = value === categoryFilter ? undefined : value;

      onFilterChange('categoryFilter', newValue);
      handleCategoryFilterClose();
    },
    [categoryFilter, handleCategoryFilterClose, onFilterChange],
  );

  const handlePriorityFilterOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) =>
      setPriorityAnchorEl(e.currentTarget),
    [],
  );

  const handlePriorityFilterClose = useCallback(
    () => setPriorityAnchorEl(null),
    [],
  );

  const handlePriorityFilterChange = useCallback(
    (value: 'low' | 'medium' | 'high') => {
      if (!onFilterChange) return;

      const newValue = value === priorityFilter ? undefined : value;

      onFilterChange('priorityFilter', newValue);
      handlePriorityFilterClose();
    },
    [handlePriorityFilterClose, onFilterChange, priorityFilter],
  );

  const handlePriceFilterOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) =>
      setPriceAnchorEl(e.currentTarget),
    [],
  );

  const handlePriceFilterClose = useCallback(() => setPriceAnchorEl(null), []);

  const handlePriceFilterChange = useCallback(
    (value: number) => {
      if (!onFilterChange) return;

      const newValue = value === priceFilter ? undefined : value;

      onFilterChange('priceFilter', newValue);
      handlePriorityFilterClose();
    },
    [handlePriorityFilterClose, onFilterChange, priceFilter],
  );

  const handleSortClick = useCallback(
    (newSortBy: WishListItemsState['listOptions']['sortBy']) => {
      if (!onSortChange) return;

      let newSortOrder: typeof sortOrder;
      if (sortBy === newSortBy) {
        newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        newSortOrder = 'asc';
      }

      onSortChange(newSortBy, newSortOrder);
      handleSortClose();
    },
    [handleSortClose, onSortChange, sortBy, sortOrder],
  );

  const sortIcon =
    sortOrder === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />;

  const renderItems = useCallback(() => {
    if (gridView) {
      return (
        <>
          {filteredItems.map(item => (
            <Grid item xs={12} sm={6} lg={4} key={item.id}>
              <WishListItem item={item} />
            </Grid>
          ))}
        </>
      );
    }

    return <WishListItemTable items={filteredItems} />;
  }, [filteredItems, gridView]);

  return (
    <div>
      <Grid container mb={2} spacing={2}>
        <Grid item>
          <Button
            onClick={() => onEditorToggle!(true)}
            variant="outlined"
            endIcon={<AddIcon />}
            size="small"
          >
            Add item
          </Button>
        </Grid>
        <Grid item>
          <ButtonGroup>
            <Button
              variant={categoryFilter ? 'contained' : 'outlined'}
              disableElevation
              onClick={handleCategoryFilterOpen}
              size="small"
            >
              Category
            </Button>
            <Button
              variant={priorityFilter ? 'contained' : 'outlined'}
              disableElevation
              onClick={handlePriorityFilterOpen}
              size="small"
            >
              Priority
            </Button>
            <Button
              variant={priceFilter ? 'contained' : 'outlined'}
              disableElevation
              onClick={handlePriceFilterOpen}
              size="small"
            >
              Price
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={handleSortOpen}
            endIcon={<SortIcon />}
            size="small"
          >
            Sort
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={onReset} size="small">
            Reset
          </Button>
        </Grid>
      </Grid>
      <Grid container mb={2}>
        <Grid item xs={12} mb={2}>
          <TextField
            label="Search"
            variant="standard"
            fullWidth
            value={searchValue ?? ''}
            onChange={e => onSearch!(e.currentTarget.value)}
          />
        </Grid>
        <Grid item xs={12} display="flex">
          <Box ml="auto">
            <IconButton
              color={gridView ? 'primary' : undefined}
              onClick={() => setGridView(true)}
            >
              <GridViewIcon />
            </IconButton>
            <IconButton
              color={!gridView ? 'primary' : undefined}
              onClick={() => setGridView(false)}
            >
              <ViewListIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {itemsLoading &&
          [...Array(6)].map((_, key) => (
            <Grid item xs={12} sm={6} lg={4} key={key}>
              <Card>
                <Skeleton height={200} animation="wave" variant="rectangular" />
                <CardContent>
                  <>
                    <Skeleton
                      animation="wave"
                      height={10}
                      sx={{ mb: 2, bgcolor: 'grey.400' }}
                    />
                    <Skeleton animation="wave" height={10} width="30%" />
                  </>
                </CardContent>
              </Card>
            </Grid>
          ))}
        {renderItems()}
        {!filteredItems.length && <CenteredMessage message="No items found" />}
      </Grid>
      <FullscreenDialog
        title={editorInitialValue ? 'Update' : 'Create'}
        open={editorOpen}
        onClose={() => onEditorToggle!(false)}
      >
        <WishListItemForm />
      </FullscreenDialog>
      <Menu
        anchorEl={categoryAnchorEl}
        open={!!categoryAnchorEl}
        onClose={handleCategoryFilterClose}
      >
        <MenuItem
          onClick={() => handleCategoryFilterChange('none')}
          selected={categoryFilter === 'none'}
        >
          none
        </MenuItem>
        {userCategories.map((category, key) => (
          <MenuItem
            onClick={() => handleCategoryFilterChange(category)}
            selected={categoryFilter === category}
            key={key}
          >
            {category}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={priorityAnchorEl}
        open={!!priorityAnchorEl}
        onClose={handlePriorityFilterClose}
      >
        <MenuItem
          selected={priorityFilter === 'low'}
          onClick={() => handlePriorityFilterChange('low')}
        >
          low
        </MenuItem>
        <MenuItem
          selected={priorityFilter === 'medium'}
          onClick={() => handlePriorityFilterChange('medium')}
        >
          medium
        </MenuItem>
        <MenuItem
          selected={priorityFilter === 'high'}
          onClick={() => handlePriorityFilterChange('high')}
        >
          high
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={priceAnchorEl}
        open={!!priceAnchorEl}
        onClose={handlePriceFilterClose}
      >
        <MenuItem
          selected={priceFilter === 30}
          onClick={() => handlePriceFilterChange(30)}
        >{`< 30`}</MenuItem>
        <MenuItem
          selected={priceFilter === 60}
          onClick={() => handlePriceFilterChange(60)}
        >{`< 60`}</MenuItem>
        <MenuItem
          selected={priceFilter === 100}
          onClick={() => handlePriceFilterChange(100)}
        >{`< 100`}</MenuItem>
      </Menu>
      <Menu
        anchorEl={sortAnchorEl}
        open={!!sortAnchorEl}
        onClose={handleSortClose}
      >
        {wishListItemSortOptions.map((option, key) => (
          <MenuItem
            key={key}
            onClick={() => handleSortClick(option)}
            selected={option === sortBy}
          >
            <Grid container>
              <Grid item>{option}</Grid>
              {option === sortBy && (
                <Grid item ml="auto">
                  {sortIcon}
                </Grid>
              )}
            </Grid>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default WishListItems;

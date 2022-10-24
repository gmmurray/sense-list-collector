import {
  Button,
  ButtonGroup,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  CollectionListState,
  collectionsListSortOptions,
  useCollectionsList,
} from '../../../components/collections/useCollectionsList';
import React, { useCallback, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box } from '@mui/system';
import ClearIcon from '@mui/icons-material/Clear';
import CollectionsList from '../../../components/collections/CollectionsList';
import GridViewSelector from '../../../components/shared/GridViewSelector';
import Link from 'next/link';
import SortIcon from '@mui/icons-material/Sort';
import { appRoutes } from '../../../lib/constants/routes';
import { useGetLatestUserCollectionsQuery } from '../../../lib/queries/collections/collectionQueries';
import usePageTitle from '../../../lib/hooks/usePageTitle';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';
import withLayout from '../../../lib/hoc/layout/withLayout';
import withUser from '../../../lib/hoc/withUser';

const ViewCollections = () => {
  usePageTitle(appRoutes.stash.collections.title);
  const { documentUser } = useUserContext();
  const { data: collections = [], isLoading: collectionsLoading } =
    useGetLatestUserCollectionsQuery(documentUser?.userId);
  const [isGridView, setIsGridView] = useState(
    !documentUser?.experience?.preferTables,
  );

  const {
    collections: visibleCollections,
    sort,
    filter,
    onSearch,
    onSort,
    onFilter,
    onReset,
    searchValue,
  } = useCollectionsList(collections);

  const [anchors, setAnchors] = useState<{
    sort: HTMLButtonElement | null;
    isPublic: HTMLButtonElement | null;
    hasItems: HTMLButtonElement | null;
  }>({
    sort: null,
    isPublic: null,
    hasItems: null,
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
    (newSortBy: CollectionListState['sortBy']) => {
      let newSortOrder: CollectionListState['sortOrder'];
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

  const handleFilterChange = useCallback(
    (key: 'isPublic' | 'hasItems', value?: boolean) => {
      const newValue = value === filter[key] ? undefined : value;
      onFilter(key, newValue);
      handleAnchorToggle(null, key);
    },
    [filter, handleAnchorToggle, onFilter],
  );

  const sortIcon =
    sort.order === 'desc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />;

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
          My collections
        </Typography>
      </Grid>
      <Grid item>
        <Link href={appRoutes.stash.collections.new.path()} passHref>
          <Button startIcon={<AddIcon />} variant="outlined" size="small">
            New
          </Button>
        </Link>
      </Grid>
      <Grid item>
        <ButtonGroup>
          <Button
            variant={filter.isPublic === undefined ? 'outlined' : 'contained'}
            disableElevation
            onClick={e => handleAnchorToggle(e, 'isPublic')}
            size="small"
          >
            Privacy
          </Button>
          <Button
            variant={filter.hasItems === undefined ? 'outlined' : 'contained'}
            disableElevation
            onClick={e => handleAnchorToggle(e, 'hasItems')}
            size="small"
          >
            Items
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={e => handleAnchorToggle(e, 'sort')}
          endIcon={<SortIcon />}
          size="small"
        >
          Sort
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={onReset}
          endIcon={<ClearIcon />}
          size="small"
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
        <CollectionsList
          isGridView={isGridView}
          collections={visibleCollections}
          loading={collectionsLoading}
        />
      </Grid>
      <Menu
        anchorEl={anchors.isPublic}
        open={!!anchors.isPublic}
        onClose={() => handleAnchorToggle(null, 'isPublic')}
      >
        <MenuItem
          onClick={() => handleFilterChange('isPublic', true)}
          selected={filter.isPublic}
        >
          public
        </MenuItem>
        <MenuItem
          onClick={() => handleFilterChange('isPublic', false)}
          selected={filter.isPublic === false}
        >
          private
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={anchors.hasItems}
        open={!!anchors.hasItems}
        onClose={() => handleAnchorToggle(null, 'hasItems')}
      >
        <MenuItem
          onClick={() => handleFilterChange('hasItems', true)}
          selected={filter.hasItems}
        >
          1+ items
        </MenuItem>
        <MenuItem
          onClick={() => handleFilterChange('hasItems', false)}
          selected={filter.hasItems === false}
        >
          0 items
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={anchors.sort}
        open={!!anchors.sort}
        onClose={() => handleAnchorToggle(null, 'sort')}
      >
        {collectionsListSortOptions.map((option, key) => (
          <MenuItem
            key={key}
            onClick={() => handleSortChange(option)}
            selected={sort.by === option}
          >
            <Box display="flex" width="100%">
              <Box>{option}</Box>
              {sort.by === option && <Box ml="auto">{sortIcon}</Box>}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  );
};

export default withLayout(withUser(ViewCollections));

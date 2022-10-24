import {
  filterAndSortCollectionsList,
  searchCollectionsList,
} from './collectionsListHelpers';
import { useCallback, useEffect, useState } from 'react';

import Fuse from 'fuse.js';
import { ICollectionWithId } from '../../entities/collection';
import { SortDir } from '../../lib/types/sort';

export const collectionsListSortOptions = [
  'name',
  'privacy',
  'items',
  'last updated',
  'created',
] as const;

export type CollectionListState = {
  resultCollections: ICollectionWithId[];
  searchValue?: string;
  sortBy: typeof collectionsListSortOptions[number];
  sortOrder: SortDir;
  isPublicFilter?: boolean;
  hasItemsFilter?: boolean;
};

const defaultCollectionListState: CollectionListState = {
  resultCollections: [],
  searchValue: undefined,
  sortBy: 'last updated',
  sortOrder: 'desc',
  isPublicFilter: undefined,
  hasItemsFilter: undefined,
};

type UseCollectionsListResult = {
  collections: ICollectionWithId[];
  sort: {
    by: CollectionListState['sortBy'];
    order: CollectionListState['sortOrder'];
  };
  filter: {
    isPublic?: boolean;
    hasItems?: boolean;
  };
  searchValue?: string;
  onSearch: (value?: string) => void;
  onSort: (
    sortBy: CollectionListState['sortBy'],
    sortOrder: CollectionListState['sortOrder'],
  ) => void;
  onFilter: (filter: 'isPublic' | 'hasItems', value?: any) => void;
  onReset: () => void;
};

let searchEngine: Fuse<ICollectionWithId>;
const fuseSearchKeys = ['name', 'description'];

const filterKeyLookup: {
  isPublic: 'isPublicFilter';
  hasItems: 'hasItemsFilter';
} = {
  isPublic: 'isPublicFilter',
  hasItems: 'hasItemsFilter',
};

export const useCollectionsList = (
  baseCollections: ICollectionWithId[],
): UseCollectionsListResult => {
  const [listState, setListState] = useState(defaultCollectionListState);

  useEffect(() => {
    searchEngine = new Fuse(baseCollections, { keys: fuseSearchKeys });
    setListState(state => ({
      ...state,
      resultCollections: filterAndSortCollectionsList(baseCollections, state),
    }));
  }, [baseCollections]);

  const handleSearch = useCallback(
    (search?: string) => {
      setListState(state => {
        const newState = {
          ...state,
          searchValue: search,
        };
        const resultCollections = filterAndSortCollectionsList(
          searchCollectionsList(
            baseCollections,
            searchEngine,
            newState.searchValue,
          ),
          newState,
        );
        return { ...newState, resultCollections };
      });
    },
    [baseCollections],
  );

  const handleSortChange = useCallback(
    (
      sortBy: CollectionListState['sortBy'],
      sortOrder: CollectionListState['sortOrder'],
    ) => {
      setListState(state => {
        const newState = {
          ...state,
          sortBy,
          sortOrder,
        };

        const resultCollections = filterAndSortCollectionsList(
          newState.resultCollections,
          newState,
        );

        return {
          ...newState,
          resultCollections,
        };
      });
    },
    [],
  );

  const handleFilterChange = useCallback(
    (filter: 'isPublic' | 'hasItems', value?: any) => {
      setListState(state => {
        const newState: CollectionListState = {
          ...state,
          [filterKeyLookup[filter]]: value,
        };
        const toProcess = searchCollectionsList(
          baseCollections,
          searchEngine,
          newState.searchValue,
        );
        const resultCollections = filterAndSortCollectionsList(
          toProcess,
          newState,
        );

        return {
          ...newState,
          resultCollections,
        };
      });
    },
    [baseCollections],
  );

  const handleReset = useCallback(() => {
    setListState(() => {
      const newState: CollectionListState = defaultCollectionListState;

      const resultCollections = filterAndSortCollectionsList(
        baseCollections,
        newState,
      );

      return {
        ...newState,
        resultCollections,
      };
    });
  }, [baseCollections]);

  return {
    collections: listState.resultCollections,
    sort: { by: listState.sortBy, order: listState.sortOrder },
    filter: {
      isPublic: listState.isPublicFilter,
      hasItems: listState.hasItemsFilter,
    },
    searchValue: listState.searchValue,
    onSearch: handleSearch,
    onSort: handleSortChange,
    onFilter: handleFilterChange,
    onReset: handleReset,
  };
};

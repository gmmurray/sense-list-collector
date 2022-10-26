import { useCallback, useEffect, useMemo, useState } from 'react';

import Fuse from 'fuse.js';
import { SortDir } from '../../lib/types/sort';

type filterDefinition = { [x: string]: any };

export type ManagedListState<R, S, F extends filterDefinition> = {
  result: R[];
  searchValue?: string;
  sortBy: S;
  sortOrder: SortDir;
  filter: F;
};

function getDefaultState<R, S, F extends filterDefinition>(
  defaultSort: S,
  defaultOrder: SortDir,
  filter: F,
): ManagedListState<R, S, F> {
  return {
    result: [],
    searchValue: undefined,
    sortBy: defaultSort,
    sortOrder: defaultOrder,
    filter,
  };
}

type UseManagedListResult<R, S, F extends filterDefinition> = {
  result: ManagedListState<R, S, F>['result'];
  sort: {
    by: ManagedListState<R, S, F>['sortBy'];
    order: ManagedListState<R, S, F>['sortOrder'];
  };
  filter: ManagedListState<R, S, F>['filter'];
  searchValue?: ManagedListState<R, S, F>['searchValue'];
  onSearch: (value?: string) => void;
  onSort: (
    sortBy: ManagedListState<R, S, F>['sortBy'],
    sortOrder: ManagedListState<R, S, F>['sortOrder'],
  ) => void;
  onFilter: (
    filter: keyof ManagedListState<R, S, F>['filter'],
    value?: any,
  ) => void;
  onReset: () => void;
};

type UseManagedListParams<R, S, F extends filterDefinition> = {
  baseList: R[];
  defaultSort: S;
  defaultOrder: SortDir;
  filter: F;
  searchKeys: string[];
  filterAndSortFunction: (list: R[], options: ManagedListState<R, S, F>) => R[];
  searchFunction: (list: R[], engine: Fuse<R>, value?: string) => R[];
};

export function useManagedList<R, S, F extends filterDefinition>({
  baseList,
  defaultSort,
  defaultOrder,
  filter,
  searchKeys,
  filterAndSortFunction,
  searchFunction,
}: UseManagedListParams<R, S, F>): UseManagedListResult<R, S, F> {
  const [listState, setListState] = useState(
    getDefaultState<R, S, F>(defaultSort, defaultOrder, filter),
  );

  const searchEngine = useMemo(
    () => new Fuse(baseList, { keys: searchKeys }),
    [baseList, searchKeys],
  );

  useEffect(() => {
    setListState(state => ({
      ...state,
      result: filterAndSortFunction(baseList, state),
    }));
  }, [baseList, filterAndSortFunction]);

  const handleSearch = useCallback(
    (search?: string) => {
      setListState(state => {
        const newState = {
          ...state,
          searchValue: search,
        };
        const result = filterAndSortFunction(
          searchFunction(
            baseList,
            searchEngine,
            //getSearchEngine<R>(baseList, searchKeys),
            newState.searchValue,
          ),
          newState,
        );
        return { ...newState, result };
      });
    },
    [baseList, filterAndSortFunction, searchEngine, searchFunction],
  );

  const handleSortChange = useCallback(
    (sortBy: S, sortOrder: SortDir) => {
      setListState(state => {
        const newState = {
          ...state,
          sortBy,
          sortOrder,
        };

        const result = filterAndSortFunction(newState.result, newState);

        return {
          ...newState,
          result,
        };
      });
    },
    [filterAndSortFunction],
  );

  const handleFilterChange = useCallback(
    (filter: keyof F, value?: any) => {
      setListState(state => {
        const newState = {
          ...state,
          filter: {
            ...state.filter,
            [filter]: value,
          } as F,
        };
        const toProcess = searchFunction(
          baseList,
          searchEngine,
          newState.searchValue,
        );
        const result = filterAndSortFunction(toProcess, newState);

        return {
          ...newState,
          result,
        };
      });
    },
    [baseList, filterAndSortFunction, searchEngine, searchFunction],
  );

  const handleReset = useCallback(() => {
    setListState(() => {
      const newState = getDefaultState<R, S, F>(
        defaultSort,
        defaultOrder,
        filter,
      );

      const result = filterAndSortFunction(baseList, newState);

      return {
        ...newState,
        result,
      };
    });
  }, [defaultSort, defaultOrder, filter, filterAndSortFunction, baseList]);

  return {
    result: listState.result,
    sort: { by: listState.sortBy, order: listState.sortOrder },
    filter: listState.filter,
    searchValue: listState.searchValue,
    onSearch: handleSearch,
    onSort: handleSortChange,
    onFilter: handleFilterChange,
    onReset: handleReset,
  };
}

import { ManagedListState, useManagedList } from '../shared/useManagedList';
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

type CollectionsListFilterDefinition = {
  isPublic?: boolean;
  hasItems?: boolean;
};

export type CollectionListState = ManagedListState<
  ICollectionWithId,
  typeof collectionsListSortOptions[number],
  CollectionsListFilterDefinition
>;

const searchKeys = ['name', 'description'];

const defaultSort = 'last updated';

const defaultOrder = 'desc';
const filter = {
  isPublic: undefined,
  hasItems: undefined,
};

export const useCollectionsList = (baseList: ICollectionWithId[]) => {
  const filterAndSortFunction = useCallback(filterAndSortCollectionsList, []);
  const searchFunction = useCallback(searchCollectionsList, []);

  return useManagedList<
    ICollectionWithId,
    CollectionListState['sortBy'],
    CollectionListState['filter']
  >({
    baseList,
    defaultSort,
    defaultOrder,
    filter,
    searchKeys,
    filterAndSortFunction,
    searchFunction,
  });
};

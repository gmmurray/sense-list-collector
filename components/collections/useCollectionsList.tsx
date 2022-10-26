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

export const useCollectionsList = (collections: ICollectionWithId[]) =>
  useManagedList<
    ICollectionWithId,
    CollectionListState['sortBy'],
    CollectionListState['filter']
  >({
    baseList: collections,
    defaultSort: 'last updated',
    defaultOrder: 'desc',
    filter: {
      isPublic: undefined,
      hasItems: undefined,
    },
    searchKeys: ['name', 'description'],
    filterAndSortFunction: filterAndSortCollectionsList,
    searchFunction: searchCollectionsList,
  });

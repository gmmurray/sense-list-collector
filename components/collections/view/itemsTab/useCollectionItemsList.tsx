import {
  ManagedListState,
  useManagedList,
} from '../../../shared/useManagedList';
import {
  filterAndSortCollectionItemsList,
  searchCollectionItemsList,
} from './collectionItemsListHelpers';

import { IItemWithId } from '../../../../entities/item';
import { useCallback } from 'react';

export const collectionItemsListSortOptions = [
  'name',
  'category',
  'last updated',
  'created',
] as const;

type CollectionItemsListFilterDefinition = {
  category?: string;
};

export type CollectionItemsListState = ManagedListState<
  IItemWithId,
  typeof collectionItemsListSortOptions[number],
  CollectionItemsListFilterDefinition
>;

const defaultSort = 'name';
const defaultOrder = 'asc';
const filter = {
  category: undefined,
};
const searchKeys = ['name', 'description', 'category'];

export const useCollectionItemsList = (baseList: IItemWithId[]) => {
  const filterAndSortFunction = useCallback(
    filterAndSortCollectionItemsList,
    [],
  );
  const searchFunction = useCallback(searchCollectionItemsList, []);

  return useManagedList<
    IItemWithId,
    CollectionItemsListState['sortBy'],
    CollectionItemsListState['filter']
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

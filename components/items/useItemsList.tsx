import { ManagedListState, useManagedList } from '../shared/useManagedList';
import { filterAndSortItemsList, searchItemsList } from './itemsListHelpers';

import { IItemWithId } from '../../entities/item';
import { useCallback } from 'react';

export const itemsListSortOptions = [
  'name',
  'category',
  'collections',
  'last updated',
  'created',
] as const;

type ItemsListFilterDefinition = {
  category?: string;
  hasCollections?: boolean;
};

export type ItemsListState = ManagedListState<
  IItemWithId,
  typeof itemsListSortOptions[number],
  ItemsListFilterDefinition
>;

const defaultSort = 'last updated';
const defaultOrder = 'desc';
const filter = {
  category: undefined,
  hasCollections: undefined,
};
const searchKeys = ['name', 'description', 'category'];

export const useItemsList = (baseList: IItemWithId[]) => {
  const filterAndSortFunction = useCallback(filterAndSortItemsList, []);
  const searchFunction = useCallback(searchItemsList, []);

  return useManagedList<
    IItemWithId,
    ItemsListState['sortBy'],
    ItemsListState['filter']
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

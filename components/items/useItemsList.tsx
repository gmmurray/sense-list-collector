import { ManagedListState, useManagedList } from '../shared/useManagedList';
import { filterAndSortItemsList, searchItemsList } from './itemsListHelpers';

import { IItemWithId } from '../../entities/item';

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

export const useItemsList = (items: IItemWithId[]) => {
  return useManagedList<
    IItemWithId,
    ItemsListState['sortBy'],
    ItemsListState['filter']
  >({
    baseList: items,
    defaultSort: 'last updated',
    defaultOrder: 'desc',
    filter: {
      category: undefined,
      hasCollections: undefined,
    },
    searchKeys: ['name', 'description', 'category'],
    filterAndSortFunction: filterAndSortItemsList,
    searchFunction: searchItemsList,
  });
};

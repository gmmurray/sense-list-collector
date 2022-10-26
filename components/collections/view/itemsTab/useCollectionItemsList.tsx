import {
  ManagedListState,
  useManagedList,
} from '../../../shared/useManagedList';
import {
  filterAndSortCollectionItemsList,
  searchCollectionItemsList,
} from './collectionItemsListHelpers';

import { IItemWithId } from '../../../../entities/item';

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

export const useCollectionItemsList = (items: IItemWithId[]) =>
  useManagedList<
    IItemWithId,
    CollectionItemsListState['sortBy'],
    CollectionItemsListState['filter']
  >({
    baseList: items,
    defaultSort: 'name',
    defaultOrder: 'asc',
    filter: {
      category: undefined,
    },
    searchKeys: ['name', 'description', 'category'],
    filterAndSortFunction: filterAndSortCollectionItemsList,
    searchFunction: searchCollectionItemsList,
  });

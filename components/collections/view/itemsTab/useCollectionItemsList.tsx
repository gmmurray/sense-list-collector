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
  `owner's choice`,
  'name',
  'category',
  'last updated',
  'created',
] as const;

type CollectionItemsListFilterDefinition = {
  category?: string;
};

type baseListState = ManagedListState<
  IItemWithId,
  typeof collectionItemsListSortOptions[number],
  CollectionItemsListFilterDefinition
>;

export type CollectionItemsListState = {
  itemPositionMap: Map<string, number>;
} & baseListState;

const defaultSort = `owner's choice`;
const defaultOrder = 'asc';
const filter = {
  category: undefined,
};
const searchKeys = ['name', 'description', 'category'];

export const useCollectionItemsList = (
  baseList: IItemWithId[],
  ordinalIds: string[],
) => {
  const filterAndSortFunction = useCallback(
    (items: IItemWithId[], options: baseListState) => {
      const itemPositionMap = new Map(
        ordinalIds.map((id, index) => [id, index]),
      );
      return filterAndSortCollectionItemsList(items, {
        ...options,
        itemPositionMap,
      });
    },
    [ordinalIds],
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

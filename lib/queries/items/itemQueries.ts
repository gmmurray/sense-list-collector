import {
  getItemsInCollection,
  getLatestUserItems,
  getUserItem,
} from '../../../entities/item';

import { ICollectionWithId } from '../../../entities/collection';
import { useQuery } from '@tanstack/react-query';

export const itemQueryKeys = {
  itemsInCollection: 'items-in-collection',
  latestUserItems: 'latest-user-items',
  singleItem: 'single-item',
};

export const useGetItemsInCollectionQuery = (collection?: ICollectionWithId) =>
  useQuery(
    [itemQueryKeys.itemsInCollection, { collectionId: collection?.id }],
    () => getItemsInCollection(collection),
    {
      enabled: !!collection,
    },
  );

export const useGetLatestUserItemsQuery = (userId?: string, count?: number) =>
  useQuery(
    [itemQueryKeys.latestUserItems, { userId, count }],
    () => getLatestUserItems(userId, count),
    {
      enabled: !!userId,
    },
  );

export const useGetUserItemQuery = (itemId?: string, userId?: string) =>
  useQuery(
    [itemQueryKeys.singleItem, { itemId }],
    () => getUserItem(itemId, userId),
    { enabled: !!userId && !!itemId },
  );

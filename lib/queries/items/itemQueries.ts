import {
  getItemsInCollection,
  getLatestUserItems,
  getUserItem,
} from '../../../entities/item';

import { ICollectionWithId } from '../../../entities/collection';
import { useQuery } from '@tanstack/react-query';

export const itemQueryKeys = {
  all: ['items'] as const,
  itemsInCollection: (collectionId?: string) =>
    [...itemQueryKeys.all, 'items-in-collection', { collectionId }] as const,
  latestUserItems: (userId?: string, count?: number) =>
    [...itemQueryKeys.all, 'latest-user-items', { userId, count }] as const,
  singleItem: (itemId?: string, userId?: string) => [
    ...itemQueryKeys.all,
    'single-item',
    { itemId, userId },
  ],
};

export const useGetItemsInCollectionQuery = (collection?: ICollectionWithId) =>
  useQuery(
    itemQueryKeys.itemsInCollection(collection?.id),
    () => getItemsInCollection(collection),
    {
      enabled: !!collection,
    },
  );

export const useGetLatestUserItemsQuery = (userId?: string, count?: number) =>
  useQuery(
    itemQueryKeys.latestUserItems(userId, count),
    () => getLatestUserItems(userId, count),
    {
      enabled: !!userId,
    },
  );

export const useGetUserItemQuery = (itemId?: string, userId?: string) =>
  useQuery(
    itemQueryKeys.singleItem(itemId, userId),
    () => getUserItem(itemId, userId),
    { enabled: !!userId && !!itemId },
  );

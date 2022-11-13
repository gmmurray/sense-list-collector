import {
  getItemsInCollection,
  getLatestUserItems,
  getUserItem,
} from '../../../entities/item';

import { ICollectionWithId } from '../../../entities/collection';
import ReactQueryKeys from 'react-query-keys';
import { useQuery } from '@tanstack/react-query';

export const itemQueryKeys = new ReactQueryKeys('items', {
  keyDefinitions: {
    itemsInCollection: {
      dynamicVariableNames: ['collectionId'],
    },
    latestUserItems: {
      dynamicVariableNames: ['userId', 'count'],
    },
    singleItem: {
      dynamicVariableNames: ['itemId', 'userId'],
    },
  },
});

export const useGetItemsInCollectionQuery = (collection?: ICollectionWithId) =>
  useQuery(
    itemQueryKeys.key('itemsInCollection', { collectionId: collection?.id }),
    () => getItemsInCollection(collection),
    {
      enabled: !!collection,
    },
  );

export const useGetLatestUserItemsQuery = (userId?: string, count?: number) =>
  useQuery(
    itemQueryKeys.key('latestUserItems', { userId, count }),
    () => getLatestUserItems(userId, count),
    {
      enabled: !!userId,
    },
  );

export const useGetUserItemQuery = (itemId?: string, userId?: string) =>
  useQuery(
    itemQueryKeys.key('singleItem', { itemId, userId }),
    () => getUserItem(itemId, userId),
    { enabled: !!userId && !!itemId },
  );

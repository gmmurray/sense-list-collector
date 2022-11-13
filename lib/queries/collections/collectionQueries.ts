import {
  getCollection,
  getLatestUserCollections,
  searchCollections,
} from '../../../entities/collection';

import { ICollectionSearchOptions } from '../../types/collectionSearchTypes';
import ReactQueryKeys from 'react-query-keys';
import { useQuery } from '@tanstack/react-query';

export const collectionQueryKeys = new ReactQueryKeys('collections', {
  keyDefinitions: {
    latestUserCollections: {
      dynamicVariableNames: ['userId', 'count'],
    },
    collection: {},
    singleCollection: {
      dynamicVariableNames: ['collectionId', 'userId'],
    },
    search: {
      dynamicVariableNames: ['options'],
    },
  },
});

export const useGetLatestUserCollectionsQuery = (
  userId?: string,
  count?: number,
) =>
  useQuery(
    collectionQueryKeys.key('latestUserCollections', { userId, count }),
    () => getLatestUserCollections(userId, count),
    {
      enabled: !!userId,
    },
  );

export const useGetCollectionQuery = (collectionId?: string, userId?: string) =>
  useQuery(
    collectionQueryKeys.key('singleCollection', { collectionId, userId }),
    () => getCollection(collectionId, userId),
    {
      enabled: !!collectionId,
    },
  );

export const useSearchCollectionQuery = (options: ICollectionSearchOptions) =>
  useQuery(collectionQueryKeys.key('search', { options }), () =>
    searchCollections(options),
  );

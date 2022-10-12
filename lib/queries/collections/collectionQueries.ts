import {
  getCollection,
  getLatestUserCollections,
  searchCollections,
} from '../../../entities/collection';

import { ICollectionSearchOptions } from '../../types/collectionSearchTypes';
import { useQuery } from '@tanstack/react-query';

export const collectionQueryKeys = {
  all: ['collections'] as const,
  latestUserCollections: (userId?: string, count?: number) =>
    [
      ...collectionQueryKeys.all,
      'latest-user-collections',
      { userId, count },
    ] as const,
  singleCollection: (collectionId?: string, userId?: string) =>
    [
      ...collectionQueryKeys.all,
      'single-collection',
      { collectionId, userId },
    ] as const,
  search: (options: ICollectionSearchOptions) =>
    [...collectionQueryKeys.all, 'search', { ...options }] as const,
};
export const useGetLatestUserCollectionsQuery = (
  userId?: string,
  count?: number,
) =>
  useQuery(
    collectionQueryKeys.latestUserCollections(userId, count),
    () => getLatestUserCollections(userId, count),
    {
      enabled: !!userId,
    },
  );

export const useGetCollectionQuery = (collectionId?: string, userId?: string) =>
  useQuery(
    collectionQueryKeys.singleCollection(collectionId, userId),
    () => getCollection(collectionId, userId),
    {
      enabled: !!collectionId,
    },
  );

export const useSearchCollectionQuery = (options: ICollectionSearchOptions) =>
  useQuery(collectionQueryKeys.search(options), () =>
    searchCollections(options),
  );

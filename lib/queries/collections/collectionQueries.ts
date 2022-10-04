import {
  getCollection,
  getLatestUserCollections,
} from '../../../entities/collection';

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
    [...collectionQueryKeys.all, 'single-collection'] as const,
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

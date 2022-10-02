import {
  getCollection,
  getLatestUserCollections,
} from '../../../entities/collection';

import { useQuery } from '@tanstack/react-query';

export const collectionQueryKeys = {
  latestUserCollections: 'latest-user-collections',
  singleCollection: 'single-collection',
};
export const useGetLatestUserCollectionsQuery = (
  userId?: string,
  count?: number,
) =>
  useQuery(
    [collectionQueryKeys.latestUserCollections, { userId, count }],
    () => getLatestUserCollections(userId, count),
    {
      enabled: !!userId,
    },
  );

export const useGetCollectionQuery = (collectionId?: string, userId?: string) =>
  useQuery(
    [collectionQueryKeys.singleCollection, { collectionId }],
    () => getCollection(collectionId, userId),
    {
      enabled: !!collectionId,
    },
  );

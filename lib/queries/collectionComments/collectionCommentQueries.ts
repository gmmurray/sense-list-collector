import {
  getCommentsInCollection,
  getCommentsInCollectionLimited,
} from '../../../entities/collectionComments';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import ReactQueryKeys from 'react-query-keys';

export const collectionCommentQueryKeys = new ReactQueryKeys(
  'collection-comments',
  {
    keyDefinitions: {
      byCollection: {
        dynamicVariableNames: ['collectionId'],
      },
      byCollectionLimited: {
        dynamicVariableNames: ['collectionId'],
      },
    },
  },
);

export function useGetCommentsForCollectionQuery(collectionId: string) {
  return useQuery(
    collectionCommentQueryKeys.key('byCollection', { collectionId }),
    () => getCommentsInCollection(collectionId),
  );
}

export function useGetCommentsForCollectionLimitedQuery(collectionId: string) {
  return useInfiniteQuery({
    queryKey: collectionCommentQueryKeys.key('byCollectionLimited', {
      collectionId,
    }),
    queryFn: ({ pageParam = { collectionId } }) =>
      getCommentsInCollectionLimited(pageParam),
    getNextPageParam: last => (last.hasNext ? last : undefined),
  });
}

import {
  COLLECTION_COMMENTS_PAGE_SIZE,
  getCommentsInCollection,
  getCommentsInCollectionLimited,
} from '../../../entities/collectionComments';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { ICollectionCommentListOptions } from '../../types/collectionCommentListTypes';

export const collectionCommentQueryKeys = {
  all: ['collection-comments'] as const,
  byCollection: (collectionId: string) => [
    ...collectionCommentQueryKeys.all,
    'by-collection',
    { collectionId },
  ],
  byCollectionLimited: (collectionId: string) => [
    ...collectionCommentQueryKeys.all,
    'by-collection',
    { collectionId },
  ],
};

export function useGetCommentsForCollectionQuery(collectionId: string) {
  return useQuery(collectionCommentQueryKeys.byCollection(collectionId), () =>
    getCommentsInCollection(collectionId),
  );
}

export function useGetCommentsForCollectionLimitedQuery(collectionId: string) {
  return useInfiniteQuery({
    queryKey: collectionCommentQueryKeys.byCollectionLimited(collectionId),
    queryFn: ({ pageParam = { collectionId } }) =>
      getCommentsInCollectionLimited(pageParam),
    getNextPageParam: last => (last.hasNext ? last : undefined),
  });
}

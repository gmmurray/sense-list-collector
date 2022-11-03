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
  byCollectionLimited: (options?: ICollectionCommentListOptions) => [
    ...collectionCommentQueryKeys.all,
    'by-collection',
    { ...(options ?? {}) },
  ],
};

export function useGetCommentsForCollectionQuery(collectionId: string) {
  return useQuery(collectionCommentQueryKeys.byCollection(collectionId), () =>
    getCommentsInCollection(collectionId),
  );
}

export function useGetCommentsForCollectionLimitedQuery(collectionId: string) {
  return useInfiniteQuery({
    queryKey: collectionCommentQueryKeys.byCollectionLimited(),
    queryFn: ({ pageParam = { collectionId } }) =>
      getCommentsInCollectionLimited(pageParam),
    getNextPageParam: last => {
      return last.nextCursor ? last : undefined;
    },
  });
}

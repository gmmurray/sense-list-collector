import {
  DocumentData,
  QuerySnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import {
  FirebaseCollectionCommentWithId,
  ICollectionCommentWithId,
  collectionCommentsCollection,
  getCommentsInCollection,
} from '../../../entities/collectionComments';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

export const collectionCommentQueryKeys = {
  all: ['collection-comments'] as const,
  byCollection: (collectionId: string) => [
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

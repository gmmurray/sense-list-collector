import {
  ICollectionComment,
  createCollectionComment,
  deleteCollectionComment,
  updateCollectionCommentLikes,
} from '../../../entities/collectionComments';

import { collectionCommentQueryKeys } from './collectionCommentQueries';
import { reactQueryClient } from '../../../config/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const useCreateCollectionCommentMutation = (collectionId: string) =>
  useMutation(
    (comment: ICollectionComment) =>
      createCollectionComment(comment, collectionId),
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(
          collectionCommentQueryKeys.byCollectionLimited(collectionId),
        ),
    },
  );

export const useUpdateCollectionCommentLikesMutation = (collectionId: string) =>
  useMutation(
    ({
      commentId,
      userId,
      isAdditive,
    }: {
      commentId: string;
      userId: string;
      isAdditive: boolean;
    }) =>
      updateCollectionCommentLikes(commentId, collectionId, userId, isAdditive),
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(
          collectionCommentQueryKeys.byCollectionLimited(collectionId),
        ),
    },
  );

export const useDeleteCollectionCommentMutation = (collectionId: string) =>
  useMutation(
    (commentId: string) => deleteCollectionComment(commentId, collectionId),
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(
          collectionCommentQueryKeys.byCollectionLimited(collectionId),
        ),
    },
  );

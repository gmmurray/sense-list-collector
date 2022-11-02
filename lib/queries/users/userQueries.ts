import {
  USER_PAGE_COLLECTION_LIMIT,
  getUserDocument,
  getUserProfile,
  getUserProfileWithUserId,
} from '../../../entities/user';
import { useQueries, useQuery } from '@tanstack/react-query';

import { IUserPageResult } from '../../types/UserPageResult';
import { USER_DOCUMENT_NOT_FOUND_ERROR } from '../../constants/errors';
import { getDateFromFirestoreTimestamp } from '../../helpers/firestoreHelpers';
import { getLatestUserCollections } from '../../../entities/collection';
import { uniqueElements } from '../../helpers/arrayHelpers';

export const userQueryKeys = {
  all: ['users'] as const,
  single: (userId?: string) => [...userQueryKeys.all, 'single', { userId }],
  profile: (userId?: string) => [...userQueryKeys.all, 'profile', { userId }],
  page: (userId?: string) => [...userQueryKeys.all, 'page', { userId }],
};

export const useGetUserQuery = (userId?: string) =>
  useQuery(userQueryKeys.single(userId), () => getUserDocument(userId), {
    enabled: !!userId,
  });

export const useGetUserProfileQuery = (userId?: string) =>
  useQuery(
    userQueryKeys.profile(userId),
    () => getUserProfileWithUserId(userId),
    {
      enabled: !!userId,
    },
  );

export const useGetUserProfilesQueries = (userIds: string[]) =>
  useQueries({
    queries: userIds.map(id => ({
      queryKey: userQueryKeys.profile(id),
      queryFn: () => getUserProfileWithUserId(id),
    })),
  });

export const useGetUserProfilePageQuery = (userId?: string) =>
  useQuery(
    userQueryKeys.page(userId),
    async (): Promise<IUserPageResult> => {
      const user = await getUserDocument(userId);

      if (!user.profile) throw USER_DOCUMENT_NOT_FOUND_ERROR;

      const collections = await getLatestUserCollections(
        userId,
        USER_PAGE_COLLECTION_LIMIT,
        true,
      );

      const uniqueCollectionItemIds = uniqueElements(
        collections.map(c => c.itemIds).flat(),
      );

      return {
        userId: user.userId,
        profile: user.profile,
        createdAt: getDateFromFirestoreTimestamp(user.createdAt),
        collectionCount: collections.length,
        itemCount: uniqueCollectionItemIds.length,
      };
    },
    { enabled: !!userId },
  );

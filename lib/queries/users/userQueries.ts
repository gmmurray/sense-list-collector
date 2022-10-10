import { getUserDocument, getUserProfile } from '../../../entities/user';

import { useQuery } from '@tanstack/react-query';

export const userQueryKeys = {
  all: ['users'] as const,
  single: (userId?: string) => [...userQueryKeys.all, 'single', { userId }],
  profile: (userId?: string) => [...userQueryKeys.all, 'profile', { userId }],
};

export const useGetUserQuery = (userId?: string) =>
  useQuery(userQueryKeys.single(userId), () => getUserDocument(userId), {
    enabled: !!userId,
  });

export const useGetUserProfileQuery = (userId?: string) =>
  useQuery(userQueryKeys.profile(userId), () => getUserProfile(userId), {
    enabled: !!userId,
  });

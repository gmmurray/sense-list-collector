import { getUserDocument } from '../../../entities/user';
import { useQuery } from '@tanstack/react-query';

export const userQueryKeys = {
  all: ['users'] as const,
  single: (userId?: string) => [...userQueryKeys.all, 'single', { userId }],
};

export const useGetUserQuery = (userId?: string) =>
  useQuery(userQueryKeys.single(userId), () => getUserDocument(userId), {
    enabled: !!userId,
  });

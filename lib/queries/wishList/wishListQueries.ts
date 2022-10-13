import { getWishList, getWishListItems } from '../../../entities/wishList';

import { useQuery } from '@tanstack/react-query';

export const wishListQueryKeys = {
  all: ['wish-list'] as const,
  getList: (userId?: string) => [
    ...wishListQueryKeys.all,
    'get-list',
    { userId },
  ],
  items: () => [...wishListQueryKeys.all, 'list-items'],
  getListItems: (userId?: string) => [...wishListQueryKeys.items(), { userId }],
};

export const useGetWishListQuery = (userId?: string) =>
  useQuery(wishListQueryKeys.getList(userId), () => getWishList(userId), {
    enabled: !!userId,
  });

export const useGetWishListItemsQuery = (userId?: string) =>
  useQuery(
    wishListQueryKeys.getListItems(userId),
    () => getWishListItems(userId),
    { enabled: !!userId },
  );

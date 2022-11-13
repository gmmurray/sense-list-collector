import { getWishList, getWishListItems } from '../../../entities/wishList';

import ReactQueryKeys from 'react-query-keys';
import { useQuery } from '@tanstack/react-query';

export const wishListQueryKeys = new ReactQueryKeys('wish-list', {
  keyDefinitions: {
    getList: {
      dynamicVariableNames: ['userId'],
    },
    items: {},
    getListItems: {
      dynamicVariableNames: ['userId'],
    },
  },
});

export const useGetWishListQuery = (userId?: string) =>
  useQuery(
    wishListQueryKeys.key('getList', { userId }),
    () => getWishList(userId),
    {
      enabled: !!userId,
    },
  );

export const useGetWishListItemsQuery = (userId?: string) =>
  useQuery(
    wishListQueryKeys.key('getListItems', { userId }),
    () => getWishListItems(userId),
    { enabled: !!userId },
  );

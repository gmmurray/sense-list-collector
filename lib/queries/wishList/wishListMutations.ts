import {
  IWishListItem,
  createWishList,
  createWishListItem,
  deleteWishListItem,
  updateWishListItem,
  updateWishListItemStatus,
} from '../../../entities/wishList';
import { createItem, createItemFromWishList } from '../../../entities/item';

import { itemQueryKeys } from '../items/itemQueries';
import { reactQueryClient } from '../../../config/reactQuery';
import { useMutation } from '@tanstack/react-query';
import { wishListQueryKeys } from './wishListQueries';

export const useCreateWishListMutation = () =>
  useMutation(({ userId }: { userId: string }) => createWishList(userId), {
    onSuccess: () =>
      reactQueryClient.invalidateQueries(wishListQueryKeys.all()),
  });

export const useCreateWishListItemMutation = () =>
  useMutation(
    ({ value, userId }: { value: IWishListItem; userId: string }) =>
      createWishListItem(value, userId),
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(wishListQueryKeys.key('items')),
    },
  );

export const useUpdateWishListItemMutation = () =>
  useMutation(
    ({ value, userId }: { value: IWishListItem; userId: string }) =>
      updateWishListItem(value, userId),
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(wishListQueryKeys.key('items')),
    },
  );

export const useUpdateWishListItemStatusMutation = () =>
  useMutation(
    ({
      id,
      userId,
      status,
    }: {
      id: string;
      userId: string;
      status: IWishListItem['status'];
    }) => updateWishListItemStatus(id, userId, status),
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(wishListQueryKeys.key('items')),
    },
  );

export const useDeleteWishListItemMutation = () =>
  useMutation(
    ({ id, userId }: { id: string; userId: string }) =>
      deleteWishListItem(id, userId),
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(wishListQueryKeys.key('items')),
    },
  );

export const useConvertWishListItemMutation = () =>
  useMutation(
    async ({
      wishListItem,
      userId,
      includeDeletion,
    }: {
      wishListItem: IWishListItem;
      userId: string;
      includeDeletion: boolean;
    }) => {
      const convertedItem = createItemFromWishList(wishListItem, userId);

      if (includeDeletion) {
        await deleteWishListItem(wishListItem.id, userId);
      }

      return await createItem(convertedItem, userId);
    },
    {
      onSuccess: async () => {
        await Promise.all([
          reactQueryClient.invalidateQueries(wishListQueryKeys.key('items')),
          reactQueryClient.invalidateQueries(itemQueryKeys.all()),
        ]);
      },
    },
  );

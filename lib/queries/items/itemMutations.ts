import {
  IItem,
  IItemWithId,
  createItem,
  createItemWithRef,
  createNewItemRef,
  deleteItem,
  updateItem,
} from '../../../entities/item';
import { deleteObject, getStorage, listAll, ref } from 'firebase/storage';
import {
  generateUserItemImageRef,
  saveFirebaseItemImage,
  saveFirebaseItemImageParams,
} from '../../../entities/firebaseFiles';

import { collectionQueryKeys } from '../collections/collectionQueries';
import { itemQueryKeys } from './itemQueries';
import { reactQueryClient } from '../../../config/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const useCreateItemMutation = () =>
  useMutation(
    ({ item, userId }: { item: IItem; userId: string }) =>
      createItem(item, userId),
    {
      onSuccess: () =>
        Promise.all([
          reactQueryClient.invalidateQueries(itemQueryKeys.all()),
          reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
        ]),
    },
  );

export const useCreateItemWithImageMutation = () =>
  useMutation(
    async ({
      userId,
      item,
      file,
      progressCallback,
    }: {
      userId: string;
      item: IItem;
      file: File;
      progressCallback: saveFirebaseItemImageParams['progressCallback'];
    }) => {
      try {
        const ref = createNewItemRef();
        const primaryImageUrl = await saveFirebaseItemImage({
          file,
          userId,
          itemId: ref.id,
          progressCallback,
        });

        return await createItemWithRef(
          { ...item, primaryImageUrl },
          userId,
          ref,
        );
      } catch (error) {
        console.log(error);
        throw new Error('Error creating item');
      }
    },
    {
      onSuccess: () => () =>
        Promise.all([
          reactQueryClient.invalidateQueries(itemQueryKeys.all()),
          reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
        ]),
    },
  );

export const useUpdateItemMutation = () =>
  useMutation(({ item }: { item: IItemWithId }) => updateItem(item), {
    onSuccess: async () =>
      await Promise.all([
        reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
        reactQueryClient.invalidateQueries(itemQueryKeys.all()),
      ]),
  });

// upload new image, update item w/ new image, delete old image
export const useUpdateItemWithImageMutation = () =>
  useMutation(
    async ({
      item,
      file,
      progressCallback,
    }: {
      item: IItemWithId;
      file: File;
      progressCallback: saveFirebaseItemImageParams['progressCallback'];
    }) => {
      // get old image ref
      const oldItemImages = await listAll(
        ref(getStorage(), generateUserItemImageRef(item.userId, item.id, true)),
      );

      const newPrimaryImageUrl = await saveFirebaseItemImage({
        file,
        userId: item.userId,
        itemId: item.id,
        progressCallback,
      });

      // update item with the new image
      await updateItem({
        ...item,
        primaryImageUrl: newPrimaryImageUrl,
      });

      // delete all old refs. there should only be one but this cleans up any orphans too
      await Promise.all([
        ...oldItemImages.items.map(oldRef => deleteObject(oldRef)),
      ]);
    },
    {
      onSuccess: async () =>
        await Promise.all([
          reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
          reactQueryClient.invalidateQueries(itemQueryKeys.all()),
        ]),
    },
  );

export const useDeleteItemMutation = () =>
  useMutation(
    async ({ itemId, userId }: { itemId?: string; userId?: string }) => {
      if (!itemId || !userId) throw new Error('Error deleting item');

      const imagesToDelete = await listAll(
        ref(getStorage(), generateUserItemImageRef(userId, itemId, true)),
      );

      // delete item itself. this handles updating collections as necessary
      await deleteItem(itemId, userId);

      // delete item's images
      await Promise.all([
        ...imagesToDelete.items.map(oldRef => deleteObject(oldRef)),
      ]);
    },
    {
      onSuccess: async () =>
        await Promise.all([
          reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
          reactQueryClient.invalidateQueries(itemQueryKeys.all()),
        ]),
    },
  );

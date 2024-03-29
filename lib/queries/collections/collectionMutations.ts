import {
  ICollection,
  ICollectionWithId,
  createCollection,
  createCollectionWithRef,
  createNewColletionRef,
  deleteCollection,
  updateCollection,
  updateCollectionFavoriteItems,
  updateCollectionItemsProperty,
  updateCollectionLikes,
  updateItemsOnCollection,
} from '../../../entities/collection';
import { deleteObject, getStorage, listAll, ref } from 'firebase/storage';
import {
  generateUserCollectionImageRef,
  saveFirebaseCollectionImage,
  saveFirebaseCollectionImageParams,
} from '../../../entities/firebaseFiles';

import { arrayMoveImmutable } from 'array-move';
import { collectionQueryKeys } from './collectionQueries';
import { itemQueryKeys } from '../items/itemQueries';
import { reactQueryClient } from '../../../config/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const useCreateCollectionMutation = () =>
  useMutation(
    ({ userId, collection }: { userId: string; collection: ICollection }) =>
      createCollection(collection, userId),
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
    },
  );

export const useCreateCollectionAndLoadImageMutation = () =>
  useMutation(
    async ({
      userId,
      collection,
      file,
      progressCallback,
    }: {
      userId: string;
      collection: ICollection;
      file: File;
      progressCallback: saveFirebaseCollectionImageParams['progressCallback'];
    }) => {
      try {
        const ref = createNewColletionRef();
        const coverImageUrl = await saveFirebaseCollectionImage({
          file,
          userId,
          collectionId: ref.id,
          progressCallback,
        });

        await createCollectionWithRef(
          { ...collection, coverImageUrl },
          userId,
          ref,
        );
        return ref.id;
      } catch (error) {
        console.log(error);
        throw new Error('Error creating collection');
      }
    },
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
    },
  );

export const useUpdateCollection = () =>
  useMutation(
    ({ collection }: { collection: ICollectionWithId }) =>
      updateCollection(collection),
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
    },
  );

// upload new image, update collection w/ new image, delete old image
export const useUpdateCollectionWithImageMutation = () =>
  useMutation(
    async ({
      collection,
      file,
      progressCallback,
    }: {
      collection: ICollectionWithId;
      file: File;
      progressCallback: saveFirebaseCollectionImageParams['progressCallback'];
    }) => {
      // get old image ref
      const oldCollectionImages = await listAll(
        ref(
          getStorage(),
          generateUserCollectionImageRef(
            collection.userId,
            collection.id,
            true,
          ),
        ),
      );

      const newCoverImageUrl = await saveFirebaseCollectionImage({
        file,
        userId: collection.userId,
        collectionId: collection.id,
        progressCallback,
      });

      // update collection with the new image
      await updateCollection({
        ...collection,
        coverImageUrl: newCoverImageUrl,
      });

      // delete all old refs. there should only be one but this cleans up any orphans too
      await Promise.all([
        ...oldCollectionImages.items.map(oldRef => deleteObject(oldRef)),
      ]);
    },
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
    },
  );

export const useUpdateCollectionItemsMutation = () =>
  useMutation(
    async ({
      collectionId,
      itemIds,
      isAdditive,
    }: {
      collectionId?: string;
      itemIds: string[];
      isAdditive: boolean;
    }) => updateItemsOnCollection(itemIds, isAdditive, collectionId),
    {
      onSuccess: async () =>
        await Promise.all([
          reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
          reactQueryClient.invalidateQueries(itemQueryKeys.all()),
        ]),
    },
  );

export const useUpdateCollectionFavoriteItemsMutation = () =>
  useMutation(
    async ({
      itemIds,
      isAdditive,
      collectionId,
    }: {
      itemIds: string[];
      isAdditive: boolean;
      collectionId?: string;
    }) => updateCollectionFavoriteItems(itemIds, isAdditive, collectionId),
    {
      onSuccess: async () => {
        await reactQueryClient.invalidateQueries(
          collectionQueryKeys.key('collection'),
        );
        await reactQueryClient.invalidateQueries(itemQueryKeys.all());
      },
    },
  );

export function useUpdateCollectionLikesMutation() {
  return useMutation(
    ({
      collectionId,
      userId,
      isAdditive,
    }: {
      collectionId: string;
      userId: string;
      isAdditive: boolean;
    }) => updateCollectionLikes(collectionId, userId, isAdditive),
    {
      onSuccess: () =>
        reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
    },
  );
}

export const useDeleteCollectionMutation = () =>
  useMutation(
    async ({
      collectionId,
      userId,
    }: {
      collectionId?: string;
      userId?: string;
    }) => {
      if (!collectionId || !userId)
        throw new Error('Error deleting collection');

      const imagesToDelete = await listAll(
        ref(
          getStorage(),
          generateUserCollectionImageRef(userId, collectionId, true),
        ),
      );

      // delete collection itself. this handles updating items as necessary
      await deleteCollection(collectionId, userId);

      // delete collection's images
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

export const useUpdateCollectionItemOrderMutation = () =>
  useMutation(
    async ({
      currList,
      itemId,
      direction,
      collectionId,
    }: {
      currList: string[];
      itemId: string;
      direction: 'up' | 'down';
      collectionId?: string;
    }) => {
      const currIndex = currList.indexOf(itemId);
      let result: string[] = [];
      // use the original order if the itemId does not exist in the array or it is an invalid move
      if (
        currIndex === -1 ||
        (direction === 'up' && currIndex === 0) ||
        (direction === 'down' && currIndex === currList.length - 0)
      ) {
        result = [...currList];
      } else {
        const newIndex = direction === 'up' ? currIndex - 1 : currIndex + 1;

        result = arrayMoveImmutable(currList, currIndex, newIndex);
      }

      return await updateCollectionItemsProperty(result, collectionId);
    },
    {
      onSuccess: async () =>
        await Promise.all([
          reactQueryClient.invalidateQueries(collectionQueryKeys.all()),
          reactQueryClient.invalidateQueries(itemQueryKeys.all()),
        ]),
    },
  );

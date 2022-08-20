import { IItemWithId, getItemsInCollection } from './item';
import {
  WriteBatch,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import { firebaseDB } from '../config/firebase';
import { mockCollections } from '../mock/collections';
import pickBy from 'lodash.pickby';

export interface ICollection {
  name: string;
  userId: string;
  description: string;
  isPublic: boolean;
  coverImageUrl?: string;
  itemIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICollectionWithId extends ICollection {
  id: string;
}

export interface ICollectionWithItems extends ICollectionWithId {
  items: IItemWithId[];
}

export const COLLECTION_COLLECTION_NAME = 'collections';

export const collectionsCollection = collection(
  firebaseDB,
  COLLECTION_COLLECTION_NAME,
);

// retrieve user or public collection
export const getCollection = async (collectionId: string, userId?: string) => {
  const ref = doc(collectionsCollection, collectionId);

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return undefined;
  }

  const result = { ...snapshot.data(), id: snapshot.id } as ICollectionWithId;

  if (result.isPublic || result.userId === userId) return result;
  else return undefined;
};

export const getCollectionWithItems = async (
  collectionId: string,
  userId?: string,
) => {
  const collection = await getCollection(collectionId, userId);

  if (!collection) return collection;

  const items = await getItemsInCollection(collectionId);

  return { ...collection, items };
};

export const getCollectionsContainingItem = async (
  itemId: string,
  userId?: string,
) => {
  const q = query(
    collectionsCollection,
    where('itemIds', 'array-contains', itemId),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map(({ id, data }) => ({ ...data(), id } as ICollectionWithId))
    .filter(c => c.isPublic || c.userId === userId);
};

export const createCollection = async (
  collection: ICollection,
  userId: string,
) => {
  const clean = pickBy({
    ...collection,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const created = await addDoc(collectionsCollection, clean);

  return created.id;
};

export const updateCollection = async (collection: ICollectionWithId) => {
  const ref = doc(collectionsCollection, collection.id);

  const clean = pickBy({
    ...collection,
    id: undefined,
    updatedAt: serverTimestamp(),
  });

  return await setDoc(ref, clean);
};

export const addItemsToCollectionBatch = (
  id: string,
  itemIds: string[],
  batch: WriteBatch,
) => {
  return batch.update(doc(collectionsCollection, id), {
    itemIds: arrayUnion(itemIds),
  });
};

export const removeItemsFromCollectionBatch = (
  id: string,
  itemIds: string[],
  batch: WriteBatch,
) => {
  return batch.update(doc(collectionsCollection, id), {
    itemIds: arrayRemove(itemIds),
  });
};

export const getLatestCollections = async (
  count: number,
): Promise<ICollectionWithId[]> => {
  const res = mockCollections()
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
    .slice(0, count);

  return new Promise(resolve => setTimeout(() => resolve(res), 500));
};

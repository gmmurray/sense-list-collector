import {
  ICollectionWithId,
  addItemsToCollectionBatch,
  getCollectionsContainingItem,
  removeItemsFromCollectionBatch,
} from './collection';
import {
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
  writeBatch,
} from 'firebase/firestore';

import { firebaseDB } from '../config/firebase';
import { mockItems } from '../mock/items';
import { mockPromisify } from '../lib/helpers/promises';
import pickBy from 'lodash.pickby';

export interface IItem {
  name: string;
  userId: string;
  primaryImageUrl?: string;
  price?: string;
  description?: string;
  category?: string;
  images: string[];
  rating?: number;
  collectionIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IItemWithId extends IItem {
  id: string;
}

export interface IItemWithCollections extends IItemWithId {
  collections: ICollectionWithId[];
}

export const ITEMS_COLLECTION_NAME = 'items';

export const itemsCollection = collection(firebaseDB, ITEMS_COLLECTION_NAME);

export const getItem = async (
  itemId: string,
): Promise<IItemWithId | undefined> => {
  const ref = doc(itemsCollection, itemId);

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return undefined;
  }

  return { ...snapshot.data(), id: snapshot.id } as IItemWithId;
};

export const getItemWithCollections = async (
  itemId: string,
  userId?: string,
): Promise<IItemWithCollections | undefined> => {
  const item = await getItem(itemId);

  if (!item) return undefined;

  const collections = await getCollectionsContainingItem(itemId, userId);

  return { ...item, collections };
};

export const getItemsInCollection = async (
  collectionId: string,
): Promise<IItemWithId[]> => {
  const q = query(
    itemsCollection,
    where('collectionIds', 'array-contains', collectionId),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    ({ id, data }) => ({ ...data(), id } as IItemWithId),
  );
};

export const createItem = async (item: IItem, userId: string) => {
  const clean = pickBy({
    ...item,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const created = await addDoc(itemsCollection, clean);

  if (item.collectionIds.length) {
    const batch = writeBatch(firebaseDB);
    item.collectionIds.forEach(id =>
      addItemsToCollectionBatch(id, [created.id], batch),
    );
    await batch.commit();
  }

  return created.id;
};

export const updateItem = async (item: IItemWithId) => {
  const ref = doc(itemsCollection, item.id);

  const clean = pickBy({
    ...item,
    id: undefined,
    updatedAt: serverTimestamp(),
  });

  return await setDoc(ref, clean);
};

export const addItemToCollection = async (
  itemId: string,
  collectionId: string,
) => {
  const batch = writeBatch(firebaseDB);

  batch.update(doc(itemsCollection, itemId), {
    collectionIds: arrayUnion(collectionId),
  });
  addItemsToCollectionBatch(collectionId, [itemId], batch);

  return await batch.commit();
};

export const removeItemFromCollection = async (
  itemId: string,
  collectionId: string,
) => {
  const batch = writeBatch(firebaseDB);

  batch.update(doc(itemsCollection, itemId), {
    collectionIds: arrayRemove(collectionId),
  });
  removeItemsFromCollectionBatch(collectionId, [itemId], batch);

  return await batch.commit();
};

export const getLatestItems = async (count: number): Promise<IItemWithId[]> => {
  const res = mockItems()
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
    .slice(0, count);

  return mockPromisify(res);
};

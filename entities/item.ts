import {
  ICollectionWithId,
  addItemsToCollectionBatch,
  getCollectionsContainingItem,
  removeItemsFromCollectionBatch,
} from './collection';
import {
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  limit,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  performFirestoreDocRetrieval,
  performFirestoreQuery,
} from '../lib/helpers/firestoreHelpers';

import { MAX_QUERY_LIMIT } from '../lib/constants/firestoreConstants';
import { firebaseDB } from '../config/firebase';
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

export const getUserItem = async (
  itemId?: string,
  userId?: string,
): Promise<IItemWithId | undefined> => {
  if (!itemId || !userId) throw new Error('Not found');

  const ref = doc(itemsCollection, itemId);

  const item = await performFirestoreDocRetrieval<IItemWithId>(ref);

  if (item && item.userId === userId) {
    return item;
  }

  throw new Error('Not found');
};

export const getItemWithCollections = async (
  itemId: string,
  userId?: string,
): Promise<IItemWithCollections | undefined> => {
  const item = await getUserItem(itemId);

  if (!item) return undefined;

  const collections = await getCollectionsContainingItem(itemId, userId);

  return { ...item, collections };
};

export const getItemsInCollection = async (
  collection?: ICollectionWithId,
): Promise<IItemWithId[]> => {
  if (!collection?.itemIds.length) return [];

  const q = query(
    itemsCollection,
    where('collectionIds', 'array-contains', collection.id),
  );

  return await performFirestoreQuery<IItemWithId>(q);
};

export const createItem = async (item: IItem, userId: string) => {
  const clean = pickBy({
    ...item,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
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
    updatedAt: Timestamp.now(),
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

export const getLatestUserItems = async (userId?: string, count?: number) => {
  if (!userId) return [];

  const q = query(
    itemsCollection,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(count ?? MAX_QUERY_LIMIT),
  );

  return performFirestoreQuery<IItemWithId>(q);
};

import {
  DocumentData,
  DocumentReference,
  Timestamp,
  WriteBatch,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  limit,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  ICollectionWithId,
  updateItemsOnCollectionWithinBatch,
} from './collection';
import {
  performIdentifiableFirestoreDocRetrieval,
  performIdentifiableFirestoreQuery,
} from '../lib/helpers/firestoreHelpers';

import { IWishListItem } from './wishList';
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

export const itemRatingOptions = ['1', '2', '3', '4', '5'];

export const ITEM_DESCRIPTION_MAX_LENGTH = 1000;

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
): Promise<IItemWithId> => {
  if (!itemId || !userId) throw new Error('Not found');

  const ref = doc(itemsCollection, itemId);

  const item = await performIdentifiableFirestoreDocRetrieval<IItemWithId>(ref);

  if (item && item.userId === userId) {
    return item;
  }

  throw new Error('Not found');
};

export const getItemsInCollection = async (
  collection?: ICollectionWithId,
): Promise<IItemWithId[]> => {
  if (!collection?.itemIds.length) return [];

  const q = query(
    itemsCollection,
    where('collectionIds', 'array-contains', collection.id),
  );

  return await performIdentifiableFirestoreQuery<IItemWithId>(q);
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
      updateItemsOnCollectionWithinBatch(id, [created.id], batch, true),
    );
    await batch.commit();
  }

  return created.id;
};

export const createItemInBatch = async (
  item: IItem,
  userId: string,
  batch: WriteBatch,
) => {
  const clean = pickBy({
    ...item,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  const ref = doc(itemsCollection);
  batch.set(ref, clean);

  const created = await getDoc(ref);
  return created.id;
};

export const createItemWithRef = async (
  item: IItem,
  userId: string,
  ref: DocumentReference<DocumentData>,
) => {
  const clean = pickBy({
    ...item,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  await setDoc(ref, clean);

  await updateItemCollections(ref, item.collectionIds);

  return ref.id;
};

export const updateItem = async (item: IItemWithId) => {
  const ref = doc(itemsCollection, item.id);

  const clean = pickBy({
    ...item,
    id: undefined,
    updatedAt: Timestamp.now(),
  });

  const prevItemValue = await getUserItem(item.id, item.userId);

  await updateItemCollections(
    ref,
    item.collectionIds,
    prevItemValue.collectionIds,
  );

  return await setDoc(ref, clean);
};

export const updateItemCollections = async (
  ref: DocumentReference<DocumentData>,
  newCollections: string[] = [],
  oldCollections: string[] = [],
) => {
  const collectionsToAdd = newCollections.filter(
    collectionId => !oldCollections.includes(collectionId),
  );
  const collectionsToRemove = oldCollections.filter(
    collectionId => !oldCollections.includes(collectionId),
  );

  if (collectionsToAdd.length || collectionsToRemove.length) {
    const batch = writeBatch(firebaseDB);
    collectionsToAdd.forEach(collectionId =>
      updateItemsOnCollectionWithinBatch(collectionId, [ref.id], batch, true),
    );
    collectionsToRemove.forEach(collectionId =>
      updateItemsOnCollectionWithinBatch(collectionId, [ref.id], batch, false),
    );
    await batch.commit();
  }
};

// one item to many collections
export const updateCollectionsOnItem = async (
  itemId: string,
  collectionIds: string[],
  isAdditive: boolean,
) => {
  const batch = writeBatch(firebaseDB);

  batch.update(doc(itemsCollection, itemId), {
    collectionIds: isAdditive
      ? arrayUnion(...collectionIds)
      : arrayRemove(...collectionIds),
  });

  collectionIds.forEach(id =>
    updateItemsOnCollectionWithinBatch(id, [itemId], batch, isAdditive),
  );

  return await batch.commit();
};

// many items to one collection (used within a loop)
export const updateCollectionsOnItemWithinBatch = (
  itemId: string,
  collectionIds: string[],
  isAdditive: boolean,
  batch: WriteBatch,
) =>
  batch.update(doc(itemsCollection, itemId), {
    collectionIds: isAdditive
      ? arrayUnion(...collectionIds)
      : arrayRemove(...collectionIds),
  });

export const getLatestUserItems = async (userId?: string, count?: number) => {
  if (!userId) return [];

  const q = query(
    itemsCollection,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(count ?? MAX_QUERY_LIMIT),
  );

  return performIdentifiableFirestoreQuery<IItemWithId>(q);
};

export const createNewItemRef = () => doc(itemsCollection);

export const deleteItem = async (itemId?: string, userId?: string) => {
  if (!itemId || !userId) throw new Error('Error deleting item');

  const ref = doc(itemsCollection, itemId);

  const item = await getUserItem(itemId, userId);

  await updateItemCollections(ref, [], item.collectionIds);
};

export const createItemFromWishList = (
  { name, description, image, price, category }: IWishListItem,
  userId: string,
): IItem => ({
  name,
  userId,
  category,
  images: [],
  collectionIds: [],
  description,
  price,
  primaryImageUrl: image,
  updatedAt: new Date(),
  createdAt: new Date(),
});

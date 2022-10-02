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
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { IItemWithId, getItemsInCollection } from './item';
import {
  performFirestoreDocRetrieval,
  performFirestoreQuery,
} from '../lib/helpers/firestoreHelpers';

import { MAX_QUERY_LIMIT } from '../lib/constants/firestoreConstants';
import { firebaseDB } from '../config/firebase';
import pickBy from 'lodash.pickby';

export interface ICollection {
  name: string;
  userId: string;
  description: string;
  isPublic: boolean;
  coverImageUrl?: string;
  itemIds: string[];
  favoriteItemIds: string[];
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
export const getCollection = async (collectionId?: string, userId?: string) => {
  if (!collectionId) throw new Error('Not found');

  const ref = doc(collectionsCollection, collectionId);

  const collection = await performFirestoreDocRetrieval<ICollectionWithId>(ref);

  if (collection && (collection.isPublic || collection.userId === userId)) {
    return collection;
  }

  throw new Error('Not found');
};

export const getCollectionWithItems = async (
  collectionId: string,
  userId?: string,
) => {
  const collection = await getCollection(collectionId, userId);

  if (!collection) return collection;

  const items = await getItemsInCollection(collection);

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
    createdAt: Timestamp.now().toDate().toString(),
    updatedAt: Timestamp.now().toDate().toString(),
  });

  const created = await addDoc(collectionsCollection, clean);

  return created.id;
};

export const createCollectionWithRef = async (
  collection: ICollection,
  userId: string,
  ref: DocumentReference<DocumentData>,
) => {
  const clean = pickBy({
    ...collection,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  await setDoc(ref, clean);
};

export const createNewColletionRef = () => doc(collectionsCollection);

export const updateCollection = async (collection: ICollectionWithId) => {
  const ref = doc(collectionsCollection, collection.id);

  const clean = pickBy({
    ...collection,
    id: undefined,
    updatedAt: Timestamp.now(),
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

export const getLatestUserCollections = async (
  userId?: string,
  count?: number,
) => {
  if (!userId) return [];

  const q = query(
    collectionsCollection,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(count ?? MAX_QUERY_LIMIT),
  );

  return performFirestoreQuery<ICollectionWithId>(q);
};

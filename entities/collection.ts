import {
  DocumentData,
  DocumentReference,
  QueryConstraint,
  Timestamp,
  WriteBatch,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  endBefore,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  ICollectionSearchOptions,
  ICollectionSearchResult,
} from '../lib/types/collectionSearchTypes';
import {
  IItemWithId,
  getItemsInCollection,
  updateCollectionsOnItemWithinBatch,
} from './item';
import { IUserDocument, getUserProfiles } from './user';
import {
  performIdentifiableFirestoreDocRetrieval,
  performIdentifiableFirestoreQuery,
  resolveIdentifiableFirestoreSnapshotDocs,
} from '../lib/helpers/firestoreHelpers';

import { MAX_QUERY_LIMIT } from '../lib/constants/firestoreConstants';
import { firebaseDB } from '../config/firebase';
import pickBy from 'lodash.pickby';
import { uniqueElements } from '../lib/helpers/arrayHelpers';

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

export const COLLECTION_DESCRIPTION_MAX_LENGTH = 1000;

export const COLLECTION_SEARCH_PAGE_SIZE = 10;
export interface ICollectionWithId extends ICollection {
  id: string;
}

export interface ICollectionWithProfile extends ICollectionWithId {
  profile: IUserDocument['profile'];
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

  const collection =
    await performIdentifiableFirestoreDocRetrieval<ICollectionWithId>(ref);

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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
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

export const updateCollectionFavoriteItems = async (
  itemIds: string[],
  isAdditive: boolean,
  collectionId?: string,
) => {
  if (!collectionId) throw new Error('Error updating collection');

  const ref = doc(collectionsCollection, collectionId);

  await updateDoc(ref, {
    favoriteItemIds: isAdditive
      ? arrayUnion(...itemIds)
      : arrayRemove(...itemIds),
    updatedAt: Timestamp.now(),
  });
};

// one collection to many items
export const updateItemsOnCollection = async (
  itemIds: string[],
  isAdditive: boolean,
  collectionId?: string,
) => {
  if (!collectionId) throw new Error('Collection not found');
  const batch = writeBatch(firebaseDB);

  batch.update(doc(collectionsCollection, collectionId), {
    itemIds: isAdditive ? arrayUnion(...itemIds) : arrayRemove(...itemIds),
  });

  itemIds.forEach(id =>
    updateCollectionsOnItemWithinBatch(id, [collectionId], isAdditive, batch),
  );

  return await batch.commit();
};

// many collections to one item (used within a loop)
export const updateItemsOnCollectionWithinBatch = (
  collectionId: string,
  itemIds: string[],
  batch: WriteBatch,
  isAdditive: boolean,
) =>
  batch.update(doc(collectionsCollection, collectionId), {
    itemIds: isAdditive ? arrayUnion(...itemIds) : arrayRemove(...itemIds),
  });

export const getLatestUserCollections = async (
  userId?: string,
  count?: number,
  requirePublic: boolean = false,
) => {
  if (!userId) return [];

  const constraints: QueryConstraint[] = [];

  if (requirePublic) {
    constraints.push(where('isPublic', '==', true));
  }

  if (count) {
    constraints.push(limit(count));
  }

  const q = query(
    collectionsCollection,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    ...constraints,
  );

  return performIdentifiableFirestoreQuery<ICollectionWithId>(q);
};

export const deleteCollection = async (
  collectionId?: string,
  userId?: string,
) => {
  if (!collectionId || !userId) throw new Error('Error deleting collection');

  const collection = await getCollection(collectionId, userId);

  const batch = writeBatch(firebaseDB);

  collection.itemIds.forEach(itemId =>
    updateCollectionsOnItemWithinBatch(itemId, [collection.id], false, batch),
  );

  batch.delete(doc(collectionsCollection, collection.id));

  return await batch.commit();
};

export const searchCollections = async (
  options: ICollectionSearchOptions,
): Promise<ICollectionSearchResult> => {
  const conditions: QueryConstraint[] = [];

  if (options.userId) {
    conditions.push(where('userId', '==', options.userId));
  }

  if (options.lastElement && !options.firstElement) {
    conditions.push(startAfter(options.lastElement));
  }

  if (options.firstElement && !options.lastElement) {
    conditions.push(endBefore(options.firstElement));
  }

  if (options.hasItems) {
    conditions.push(where('itemIds', '!=', []));
    conditions.push(orderBy('itemIds', 'desc'));
  }

  const q = query(
    collectionsCollection,
    where('isPublic', '==', true),
    ...conditions,
    orderBy('updatedAt', 'desc'),
    limit(COLLECTION_SEARCH_PAGE_SIZE),
  );

  const collectionResult = await getDocs(q);

  const collectionData =
    resolveIdentifiableFirestoreSnapshotDocs<ICollectionWithProfile>(
      collectionResult,
    );

  const profileIds = uniqueElements(collectionData.map(c => c.userId));

  const profiles = profileIds.length ? await getUserProfiles(profileIds) : [];

  const profileMap = new Map(profiles.map(p => [p.userId, p.profile]));

  return {
    data: collectionData.map(c => ({
      ...c,
      profile: profileMap.get(c.userId),
    })),
    lastElement: collectionResult.docs[COLLECTION_SEARCH_PAGE_SIZE - 1],
    firstElement: collectionResult.docs[0],
  };
};

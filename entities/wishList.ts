import {
  WriteBatch,
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  performFirestoreDocRetrieval,
  performIdentifiableFirestoreQuery,
} from '../lib/helpers/firestoreHelpers';

import { User } from 'firebase/auth';
import { firebaseDB } from '../config/firebase';
import pickBy from 'lodash.pickby';

export const WishListItemPriorities = ['low', 'medium', 'high'];
export const WishListItemStatuses = ['need', 'own'];

export interface IWishListItem {
  id: string;
  name: string;
  link: string;
  image?: string;
  priority?: 'low' | 'medium' | 'high';
  price?: string;
  description?: string;
  category?: string;
  status?: 'need' | 'own';
}

export interface IWishList {
  userId: string;
}

export const WISH_LIST_COLLECTION_NAME = 'wish-lists';
export const WISH_LIST_ITEMS_COLLECTION_NAME = 'items';

export const wishListCollection = collection(
  firebaseDB,
  WISH_LIST_COLLECTION_NAME,
);
export const wishListItemCollection = (userId: string) =>
  collection(wishListCollection, userId, WISH_LIST_ITEMS_COLLECTION_NAME);
export const wishListItemDoc = (id: string, userId: string) =>
  doc(wishListItemCollection(userId), id);

export const getWishList = async (userId?: string) => {
  if (!userId) throw new Error('User id is required');

  const wishList = await performFirestoreDocRetrieval<IWishList>(
    doc(wishListCollection, userId),
  );

  if (!wishList) throw new Error('Wish list not found');

  return wishList;
};

export const createWishList = async (userId: string) => {
  console.log(userId);
  const ref = doc(wishListCollection, userId);

  await setDoc(ref, { userId });
};

export const getWishListItems = async (userId?: string) => {
  if (!userId) throw new Error('User id is required');

  const q = query(wishListItemCollection(userId));

  return await performIdentifiableFirestoreQuery<IWishListItem>(q);
};

export const createWishListItem = async (
  value: IWishListItem,
  userId: string,
) => {
  const clean = pickBy(value);

  const created = await addDoc(wishListItemCollection(userId), clean);

  return created.id;
};

export const updateWishListItem = async (
  value: IWishListItem,
  userId: string,
) => {
  const clean = pickBy(value);

  const ref = wishListItemDoc(value.id, userId);

  await setDoc(ref, clean);
};

export const updateWishListItemStatus = async (
  id: string,
  userId: string,
  status: IWishListItem['status'],
) => {
  const ref = wishListItemDoc(id, userId);

  await updateDoc(ref, { status });
};

export const deleteWishListItem = async (id: string, userId: string) => {
  const ref = wishListItemDoc(id, userId);

  await deleteDoc(ref);
};

export const deleteWishListItemInBatch = async (
  id: string,
  userId: string,
  batch: WriteBatch,
) => {
  const ref = wishListItemDoc(id, userId);
  batch.delete(ref);
};

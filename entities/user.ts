import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  performFirestoreDocRetrieval,
  performFirestoreQuery,
} from '../lib/helpers/firestoreHelpers';

import { USER_DOCUMENT_NOT_FOUND_ERROR } from '../lib/constants/errors';
import { firebaseDB } from '../config/firebase';

export interface IUserDocument {
  userId: string;
  categories: string[];
}

export const createDefaultUser = (userId: string): IUserDocument => ({
  userId,
  categories: [],
});

export const USER_DOCUMENTS_COLLECTION_NAME = 'users';

export const userDocumentsCollection = collection(
  firebaseDB,
  USER_DOCUMENTS_COLLECTION_NAME,
);

export const getUserDocument = async (
  userId?: string,
): Promise<IUserDocument> => {
  if (!userId) throw new Error('User id is required');

  const ref = doc(userDocumentsCollection, userId);

  const userDocument = await performFirestoreDocRetrieval<IUserDocument>(ref);

  if (!userDocument) throw USER_DOCUMENT_NOT_FOUND_ERROR;

  return userDocument;
};

export const initializeUserDocument = async (userId: string): Promise<void> => {
  const ref = doc(userDocumentsCollection, userId);
  return await setDoc(ref, createDefaultUser(userId));
};

export const updateUserCategory = async (
  category: string,
  isAdditive: boolean,
  userId?: string,
): Promise<void> => {
  if (!userId) throw new Error('User id is required');

  const ref = doc(userDocumentsCollection, userId);

  await updateDoc(ref, {
    categories: isAdditive ? arrayUnion(category) : arrayRemove(category),
  });
};

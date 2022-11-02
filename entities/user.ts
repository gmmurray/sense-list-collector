import {
  Timestamp,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  USERNAME_ALREADY_EXISTS_ERROR,
  USER_DOCUMENT_NOT_FOUND_ERROR,
} from '../lib/constants/errors';
import {
  performFirestoreDocRetrieval,
  performFirestoreQuery,
} from '../lib/helpers/firestoreHelpers';

import { RequiredProps } from '../lib/types/typeModifiers';
import { firebaseDB } from '../config/firebase';

export interface IUserProfile {
  avatar?: string;
  username: string;
  bio?: string;
}

export interface IUserProfileWithUserId extends IUserProfile {
  userId: string;
}

export interface IUserDocument {
  userId: string;
  categories: string[];
  createdAt: Date;
  experience: {
    preferTables: boolean;
    hideWishListOwned: boolean;
  };
  profile?: IUserProfile;
}

export const USER_DOCUMENT_BIO_MAX_LENGTH = 1000;
export const USER_DOCUMENT_USERNAME_LENGTH = {
  min: 5,
  max: 15,
};
export const USER_PAGE_COLLECTION_LIMIT = 50;

export const createDefaultUser = (userId: string): IUserDocument => ({
  userId,
  createdAt: Timestamp.now() as unknown as Date,
  categories: [],
  experience: {
    preferTables: false,
    hideWishListOwned: true,
  },
});

export const USER_DOCUMENTS_COLLECTION_NAME = 'users';

export const userDocumentsCollection = collection(
  firebaseDB,
  USER_DOCUMENTS_COLLECTION_NAME,
);

export const USERNAME_COLLECTION_NAME = 'usernames';

export const usernameCollection = collection(
  firebaseDB,
  USERNAME_COLLECTION_NAME,
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

export const updateUserExperience = async (
  key: keyof IUserDocument['experience'],
  value: boolean,
  userId?: string,
) => {
  if (!userId) throw new Error('User id is required');

  const ref = doc(userDocumentsCollection, userId);

  await updateDoc(ref, {
    [`experience.${key}`]: value,
  });
};

export const getUserProfile = async (userId?: string) => {
  const user = await getUserDocument(userId);

  if (!user.profile) throw new Error('Profile could not be found');

  return user.profile as RequiredProps<IUserDocument>['profile'];
};

export const getUserProfileWithUserId = async (
  userId?: string,
): Promise<IUserProfileWithUserId> => {
  const profile = await getUserProfile(userId);
  return {
    ...profile,
    userId: userId!,
  };
};

export const getUserProfiles = async (id: string[]) => {
  const q = query(userDocumentsCollection, where('userId', 'in', id));

  const users = await performFirestoreQuery<IUserDocument>(q);

  return users.map(u => ({ userId: u.userId, profile: u.profile }));
};

export const updateUserProfile = async (
  key: keyof RequiredProps<IUserDocument>['profile'],
  value: string,
  userId?: string,
) => {
  if (!userId) throw new Error('User id is required');

  const ref = doc(userDocumentsCollection, userId);

  await updateDoc(ref, {
    [`profile.${key}`]: value,
  });
};

export const isUsernameTaken = async (username: string, userId: string) => {
  const ref = doc(usernameCollection, username);

  const result = await getDoc(ref);

  return result.exists() && result.data().userId !== userId;
};

export const updateUserUsername = async (username: string, userId: string) => {
  const existing = await isUsernameTaken(username, userId);

  if (existing) throw USERNAME_ALREADY_EXISTS_ERROR;

  const user = await getUserDocument(userId);

  const batch = writeBatch(firebaseDB);

  if (user.profile?.username) {
    batch.delete(doc(usernameCollection, user.profile.username));
    batch.set(doc(usernameCollection, username), { userId });
  }

  await batch.commit();
  return await updateUserProfile('username', username, userId);
};

export const createUserUsername = async (username: string, userId: string) => {
  const ref = doc(usernameCollection, username);
  return await setDoc(ref, { userId });
};

export const createUserProfile = async (
  profile: RequiredProps<IUserDocument>['profile'],
  userId: string,
) => {
  const existing = await isUsernameTaken(profile.username, userId);

  if (existing) throw USERNAME_ALREADY_EXISTS_ERROR;

  const ref = doc(userDocumentsCollection, userId);

  await Promise.all([
    updateDoc(ref, {
      profile,
    }),
    createUserUsername(profile.username, userId),
  ]);
};

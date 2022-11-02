import {
  DocumentData,
  DocumentSnapshot,
  Timestamp,
  WriteBatch,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

import { collectionsCollection } from './collection';
import { languageFilter } from '../config/languageFilter';

export interface ICollectionComment {
  userId: string;
  content: string;
  createdAt: Date;
  likedByUserIds: string[];
}

export interface ICollectionCommentWithId extends ICollectionComment {
  id: string;
}

// for retrieving collection comments
export class FirebaseCollectionCommentWithId
  implements ICollectionCommentWithId
{
  public id!: string;
  public userId!: string;
  public content!: string;
  public createdAt!: Date;
  public likedByUserIds!: string[];
  constructor(comment: DocumentSnapshot<DocumentData>) {
    const data = comment.data();
    Object.assign(this, data);
    this.createdAt = data!.createdAt.toDate();
    this.id = comment.id;
  }
}

export const COLLECTION_COMMENT_MAX_LENGTH = 140;

export const COLLECTION_COMMENT_COLLECTION_NAME = 'collectionComments';

export const collectionCommentsCollection = (collectionId: string) =>
  collection(
    collectionsCollection,
    collectionId,
    COLLECTION_COMMENT_COLLECTION_NAME,
  );

export function collectionCommentRef(commentId: string, collectionId: string) {
  return doc(collectionCommentsCollection(collectionId), commentId);
}

export async function getCommentsInCollection(collectionId: string) {
  const q = query(
    collectionCommentsCollection(collectionId),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.reduce(
    (filtered: FirebaseCollectionCommentWithId[], doc) => {
      if (doc.exists()) {
        filtered.push(new FirebaseCollectionCommentWithId(doc));
      }
      return filtered;
    },
    [],
  );
}

export async function createCollectionComment(
  comment: ICollectionComment,
  collectionId: string,
) {
  const created = await addDoc(collectionCommentsCollection(collectionId), {
    ...comment,
    likedByUserIds: [],
    content: languageFilter.clean(comment.content),
    createdAt: Timestamp.now(),
  });

  return created.id;
}

export async function updateCollectionCommentLikes(
  commentId: string,
  collectionId: string,
  userId: string,
  isAdditive: boolean,
) {
  const ref = collectionCommentRef(commentId, collectionId);

  await updateDoc(ref, {
    likedByUserIds: isAdditive ? arrayUnion(userId) : arrayRemove(userId),
  });
}

export async function deleteCollectionComment(
  commentId: string,
  collectionId: string,
) {
  await deleteDoc(doc(collectionCommentsCollection(collectionId), commentId));
}

export function deleteCollectionCommentWithinBatch(
  id: string,
  collectionId: string,
  batch: WriteBatch,
) {
  batch.delete(doc(collectionCommentsCollection(collectionId), id));
}

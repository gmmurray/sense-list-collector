import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
  Timestamp,
  getDoc,
  getDocs,
} from 'firebase/firestore';

import { IdentifiableEntity } from '../types/IdentifiableEntity';

export const resolveFirestoreTimestamps = (data: any) => ({
  ...data,
  updatedAt: data.updatedAt.toDate(),
  createdAt: data.createdAt.toDate(),
});

export function resolveIdentifiableFirestoreSnapshotDocs<
  T extends IdentifiableEntity,
>(snapshot: QuerySnapshot<DocumentData>): T[] {
  return snapshot.docs.map(doc => {
    const data = doc.data();

    return {
      ...data,
      id: doc.id,
    } as T;
  });
}

export function resolveFirestoreSnapshotDocs<T>(
  snapshot: QuerySnapshot<DocumentData>,
): T[] {
  return snapshot.docs.map(doc => {
    const data = doc.data();

    return {
      ...data,
    } as T;
  });
}

export function resolveIdentifiableFirestoreSnapshotDoc<
  T extends IdentifiableEntity,
>(snapshot: DocumentSnapshot<DocumentData>): T | undefined {
  if (!snapshot.exists()) return undefined;

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
  } as T;
}

export function resolveFirestoreSnapshotDoc<T>(
  snapshot: DocumentSnapshot<DocumentData>,
): T | undefined {
  if (!snapshot.exists()) return undefined;

  const data = snapshot.data();

  return {
    ...data,
  } as T;
}

export async function performIdentifiableFirestoreQuery<
  T extends IdentifiableEntity,
>(query: Query<DocumentData>): Promise<T[]> {
  const snapshot = await getDocs(query);
  return resolveIdentifiableFirestoreSnapshotDocs<T>(snapshot);
}
export async function performFirestoreQuery<T>(
  query: Query<DocumentData>,
): Promise<T[]> {
  const snapshot = await getDocs(query);
  return resolveFirestoreSnapshotDocs<T>(snapshot);
}

export async function performIdentifiableFirestoreDocRetrieval<
  T extends IdentifiableEntity,
>(ref: DocumentReference<DocumentData>): Promise<T | undefined> {
  const snapshot = await getDoc(ref);
  return resolveIdentifiableFirestoreSnapshotDoc<T>(snapshot);
}

export async function performFirestoreDocRetrieval<T>(
  ref: DocumentReference<DocumentData>,
): Promise<T | undefined> {
  const snapshot = await getDoc(ref);
  return resolveFirestoreSnapshotDoc<T>(snapshot);
}

export const getDateStringFromFirestoreTimestamp = (date: Date) => {
  const validDate =
    date instanceof Date ? date : (date as unknown as Timestamp).toDate();

  return validDate.toLocaleDateString();
};

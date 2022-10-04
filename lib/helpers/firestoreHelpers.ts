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

export const resolveFirestoreTimestamps = (data: any) => ({
  ...data,
  updatedAt: data.updatedAt.toDate(),
  createdAt: data.createdAt.toDate(),
});

export function resolveFirestoreSnapshotDocs<T extends { id: string }>(
  snapshot: QuerySnapshot<DocumentData>,
): T[] {
  return snapshot.docs.map(doc => {
    const data = doc.data();

    return {
      ...data,
      id: doc.id,
    } as T;
  });
}

export function resolveFirestoreSnapshotDoc<T extends { id: string }>(
  snapshot: DocumentSnapshot<DocumentData>,
): T | undefined {
  if (!snapshot.exists()) return undefined;

  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
  } as T;
}

export async function performFirestoreQuery<T extends { id: string }>(
  query: Query<DocumentData>,
): Promise<T[]> {
  const snapshot = await getDocs(query);
  return resolveFirestoreSnapshotDocs<T>(snapshot);
}

export async function performFirestoreDocRetrieval<T extends { id: string }>(
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

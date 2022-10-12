import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import { ICollectionWithProfile } from '../../entities/collection';

export interface ICollectionSearchOptions {
  userId?: string;
  lastElement?: QueryDocumentSnapshot<DocumentData>;
  firstElement?: QueryDocumentSnapshot<DocumentData>;
  hasItems?: boolean;
}

export interface ICollectionSearchResult {
  data: ICollectionWithProfile[];
  lastElement?: QueryDocumentSnapshot<DocumentData>;
  firstElement?: QueryDocumentSnapshot<DocumentData>;
}

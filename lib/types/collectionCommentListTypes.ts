import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import { ICollectionCommentWithId } from '../../entities/collectionComments';

export interface ICollectionCommentListOptions {
  collectionId: string;
  nextCursor?: QueryDocumentSnapshot<DocumentData>;
}

export interface ICollectionCommentListResult {
  collectionId: string;
  data: ICollectionCommentWithId[];
  nextCursor?: QueryDocumentSnapshot<DocumentData>;
  hasNext: boolean;
}

import { IUserDocument } from '../../entities/user';
import { RequiredProps } from './typeModifiers';

export interface IUserPageResult {
  userId: string;
  profile: RequiredProps<IUserDocument>['profile'];
  createdAt: Date;
  collectionCount: number;
  itemCount: number;
}

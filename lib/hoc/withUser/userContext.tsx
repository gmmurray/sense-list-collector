import { createContext, useContext } from 'react';

import { IUserDocument } from '../../../entities/user';
import { User } from 'firebase/auth';

export type UserContextType = {
  authUser: User | null | undefined;
  loading: boolean;
  documentUser: IUserDocument | null | undefined;
  documentUserLoading: boolean;
};

export const initialContextValue: UserContextType = {
  authUser: null,
  loading: false,
  documentUser: null,
  documentUserLoading: false,
};

export const UserContext = createContext(initialContextValue);

export const useUserContext = () => useContext(UserContext);

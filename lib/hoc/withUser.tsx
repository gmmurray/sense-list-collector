import { Backdrop, CircularProgress } from '@mui/material';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { User, getAuth } from 'firebase/auth';
import { collection, doc, query, setDoc, where } from 'firebase/firestore';
import firebaseApp, { firebaseDB } from '../../config/firebase';

import { IUserDocument } from '../../entities/user';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';

const auth = getAuth(firebaseApp);

const getUserDocQuery = (id: string) =>
  query(collection(firebaseDB, 'users'), where('userId', '==', id));

type UserContextType = {
  authUser: User | null | undefined;
  loading: boolean;
  documentUser: IUserDocument | null | undefined;
  onUpdateDocumentUser?: (value: IUserDocument) => any;
};

const initialContextValue: UserContextType = {
  authUser: null,
  loading: false,
  documentUser: null,
};

const UserContext = createContext(initialContextValue);

export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }: any) => {
  const [user, userLoading, userError] = useAuthState(auth);
  const [userDocQuery, userDocQueryLoading] = useCollection(
    getUserDocQuery(user?.uid ?? ''),
  );
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth');
    }
  }, [userLoading, user, router]);

  const handleUserDocumentUpdate = useCallback(
    async (value: IUserDocument) => {
      if (!value.documentId || !user) return;
      const ref = doc(firebaseDB, 'users', value.documentId);

      const updates = { ...value, userId: user!.uid };
      delete updates['documentId'];

      setDoc(ref, { ...updates });
    },
    [user],
  );

  if (userLoading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const userDocQueryResult = userDocQuery?.docs[0];

  const value: UserContextType = {
    authUser: user,
    loading: userLoading,
    documentUser: userDocQueryResult
      ? {
          ...(userDocQueryResult.data() as IUserDocument),
          documentId: userDocQueryResult.id,
        }
      : null,
    onUpdateDocumentUser: handleUserDocumentUpdate,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const withUser =
  (Component: any) =>
  // eslint-disable-next-line react/display-name
  ({ ...props }: any) =>
    (
      <UserProvider>
        <Component {...props} />
      </UserProvider>
    );

export default withUser;

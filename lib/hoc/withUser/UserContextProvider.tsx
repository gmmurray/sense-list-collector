import { Backdrop, CircularProgress } from '@mui/material';
import { PropsWithChildren, useEffect } from 'react';
import { UserContext, UserContextType } from './userContext';

import { AuthPageSettings } from '../../types/authTypes';
import { appRoutes } from '../../constants/routes';
import firebaseApp from '../../../config/firebase';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useGetUserQuery } from '../../queries/users/userQueries';
import { useRouter } from 'next/router';

type UserContextProviderProps = {
  settings?: AuthPageSettings;
} & PropsWithChildren;

const UserContextProvider = ({
  settings,
  children,
}: UserContextProviderProps) => {
  const [user, userLoading] = useAuthState(getAuth(firebaseApp));

  const { data: userDocument, isLoading: userDocumentLoading } =
    useGetUserQuery(user?.uid);
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user && !settings?.isPublic) {
      router.push(appRoutes.auth.path);
    }
  }, [userLoading, user, router, settings?.isPublic]);

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

  const value: UserContextType = {
    authUser: user,
    loading: userLoading,
    documentUser: userDocument,
    documentUserLoading: userDocumentLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;

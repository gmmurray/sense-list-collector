import { Alert, Button, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { collection, doc, query, setDoc, where } from 'firebase/firestore';
import { firebaseAuth, firebaseDB } from '../../config/firebase';

import CenteredLoadingIndicator from '../../lib/components/shared/CenteredLoadingIndicator';
import { WISH_LIST_COLLECTION } from '../../lib/constants/collections';
import { WishListEntity } from '../../entities/wishList';
import { WishListItemProvider } from '../../lib/components/wishList/WishListItemsContext';
import WishListItems from '../../lib/components/wishList/WishListItems';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useSnackbarAlert } from '../../lib/components/shared/SnackbarAlert';
import withUser from '../../lib/hoc/withUser';

const wishListCollection = collection(firebaseDB, WISH_LIST_COLLECTION);

const WishListPage = () => {
  const [user] = useAuthState(firebaseAuth);
  const [value, valueLoading, valueError] = useCollection(
    query(wishListCollection, where('userId', '==', user?.uid ?? '')),
  );
  const snackbarContext = useSnackbarAlert();

  useEffect(() => {
    if (valueError) {
      snackbarContext.send(valueError.message, 'error');
    }
  }, [snackbarContext, valueError]);

  const handleCreateWishList = useCallback(async () => {
    const ref = doc(wishListCollection);

    await setDoc(ref, { ...new WishListEntity(user!) });
  }, [user]);

  const renderContent = useCallback(() => {
    if (valueLoading) {
      return <CenteredLoadingIndicator />;
    }

    const userWishList = value?.docs[0];

    if (!userWishList) {
      return (
        <div>
          <Typography variant="subtitle1" gutterBottom>
            You don&apos;t have a wish list yet
          </Typography>
          <Button onClick={handleCreateWishList} variant="contained">
            create one
          </Button>
        </div>
      );
    }

    return (
      <WishListItemProvider listId={userWishList.id}>
        <WishListItems />
      </WishListItemProvider>
    );
  }, [handleCreateWishList, value?.docs, valueLoading]);

  return (
    <div>
      <Typography variant="h2" component="h1">
        Wish list
      </Typography>
      {valueError && <Alert severity="warning">{valueError.message}</Alert>}
      {renderContent()}
    </div>
  );
};

export default withUser(WishListPage);

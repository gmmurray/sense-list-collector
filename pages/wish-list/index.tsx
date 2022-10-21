import React, { useCallback } from 'react';

import { Box } from '@mui/system';
import CenteredLoadingIndicator from '../../components/shared/CenteredLoadingIndicator';
import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import { WishListItemProvider } from '../../components/wishList/WishListItemsContext';
import WishListItems from '../../components/wishList/WishListItems';
import { appRoutes } from '../../lib/constants/routes';
import { useCreateWishListMutation } from '../../lib/queries/wishList/wishListMutations';
import { useGetWishListQuery } from '../../lib/queries/wishList/wishListQueries';
import usePageTitle from '../../lib/hooks/usePageTitle';
import { useSnackbarAlert } from '../../components/shared/SnackbarAlert';
import { useUserContext } from '../../lib/hoc/withUser/userContext';
import withLayout from '../../lib/hoc/layout/withLayout';
import withUser from '../../lib/hoc/withUser';

const WishListPage = () => {
  usePageTitle(appRoutes.wishList.title);
  const { documentUser } = useUserContext();
  const snackbarContext = useSnackbarAlert();

  const { data: wishList, isLoading: wishListLoading } = useGetWishListQuery(
    documentUser?.userId,
  );

  const createWishListMutation = useCreateWishListMutation();

  const handleCreateWishList = useCallback(async () => {
    if (!documentUser) return;

    try {
      await createWishListMutation.mutateAsync({ userId: documentUser.userId });
      snackbarContext.send('Wish list created', 'success');
    } catch (error) {
      console.log(error);
      snackbarContext.send('Error creating wish list', 'error');
    }
  }, [createWishListMutation, documentUser, snackbarContext]);

  const renderContent = () => {
    if (wishListLoading) {
      return <CenteredLoadingIndicator />;
    }

    if (!wishList || createWishListMutation.isLoading) {
      return (
        <div>
          <Typography variant="subtitle1" gutterBottom>
            You don&apos;t have a wish list yet!
          </Typography>
          <LoadingButton
            loading={createWishListMutation.isLoading}
            onClick={handleCreateWishList}
            variant="contained"
          >
            Create one
          </LoadingButton>
        </div>
      );
    }

    return (
      <WishListItemProvider>
        <WishListItems />
      </WishListItemProvider>
    );
  };

  return (
    <Box flex="1">
      <Typography variant="h2" component="h1">
        Wish list
      </Typography>
      {renderContent()}
    </Box>
  );
};

export default withLayout(withUser(WishListPage));

/* eslint-disable @next/next/no-img-element */

import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import React, { useCallback } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenteredLoadingIndicator from '../../../components/shared/CenteredLoadingIndicator';
import CenteredMessage from '../../../components/shared/CenteredMessage';
import CollectionTabProvider from '../../../components/collections/view/CollectionTabContext';
import LikeIndicator from '../../../components/shared/LikeIndicator';
import Link from 'next/link';
import ViewCollectionTabs from '../../../components/collections/view/ViewCollectionTabs';
import { appRoutes } from '../../../lib/constants/routes';
import { getCollectionCoverImageUrl } from '../../../lib/constants/images';
import { getStringFromStringOrArray } from '../../../lib/helpers/stringHelpers';
import { useGetCollectionQuery } from '../../../lib/queries/collections/collectionQueries';
import { useGetItemsInCollectionQuery } from '../../../lib/queries/items/itemQueries';
import { useGetUserProfileQuery } from '../../../lib/queries/users/userQueries';
import usePageTitle from '../../../lib/hooks/usePageTitle';
import { useRouter } from 'next/router';
import { useSnackbarAlert } from '../../../components/shared/SnackbarAlert';
import { useUpdateCollectionLikesMutation } from '../../../lib/queries/collections/collectionMutations';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';
import withLayout from '../../../lib/hoc/layout/withLayout';
import withUser from '../../../lib/hoc/withUser';

const ViewCollection = () => {
  const router = useRouter();
  const { documentUser } = useUserContext();
  const snackbar = useSnackbarAlert();
  const {
    query: { collectionId },
  } = router;

  const { data: collection, isLoading: collectionLoading } =
    useGetCollectionQuery(
      getStringFromStringOrArray(collectionId),
      documentUser?.userId,
    );

  usePageTitle(appRoutes.stash.collections.view.title(collection?.name));

  const { data: collectionItems = [], isLoading: collectionItemsLoading } =
    useGetItemsInCollectionQuery(collection);
  const { data: userProfile, isLoading: userProfileLoading } =
    useGetUserProfileQuery(collection?.userId);

  const updateLikesMutation = useUpdateCollectionLikesMutation();

  const isOwner = collection?.userId === documentUser?.userId;

  const handleUpdateLikes = useCallback(
    async (isAdditive: boolean) => {
      if (!documentUser || !collection) return;

      try {
        await updateLikesMutation.mutateAsync({
          collectionId: collection.id,
          userId: documentUser.userId,
          isAdditive,
        });
      } catch (error) {
        console.log(error);
        snackbar.send('Error updating collection likes', 'error');
      }
    },
    [collection, documentUser, snackbar, updateLikesMutation],
  );

  const renderContent = () => {
    if (collectionLoading) {
      return <CenteredLoadingIndicator />;
    } else if (!collection) {
      return <CenteredMessage message="Collection could not be found" />;
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} textAlign="center">
          <img
            src={getCollectionCoverImageUrl(collection)}
            style={{
              objectFit: 'contain',
              height: '300px',
              width: '100%',
            }}
            alt={collection.name}
          />
        </Grid>
        <Grid item xs={12}>
          <CollectionTabProvider
            collection={collection}
            collectionLoading={collectionLoading}
            items={collectionItems}
            itemsLoading={collectionItemsLoading}
            isOwner={isOwner}
          >
            <ViewCollectionTabs />
          </CollectionTabProvider>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {documentUser && (
          <Link href={appRoutes.stash.collections.path()} passHref>
            <Button startIcon={<ArrowBackIcon />} color="secondary">
              Back to collections
            </Button>
          </Link>
        )}
      </Grid>
      {!collectionLoading && collection && (
        <Grid item xs={12}>
          <Box display="flex" width="100%">
            <Typography variant="h2" component="h1">
              {collection.name}
            </Typography>
            {isOwner && (
              <Link
                href={appRoutes.stash.items.new.query.collectionId(
                  collection.id,
                )}
                passHref
              >
                <Button sx={{ ml: 'auto' }} variant="text">
                  Add new item
                </Button>
              </Link>
            )}
          </Box>
          <Box>
            <LikeIndicator
              isLiked={
                !!documentUser &&
                (collection.likedByUserIds ?? []).includes(documentUser.userId)
              }
              numLikes={(collection.likedByUserIds ?? []).length}
              enabled={!!documentUser}
              onClick={isAdditive => handleUpdateLikes(isAdditive)}
            />
          </Box>
          <Box>
            <Typography variant="body2">{collection.description}</Typography>
          </Box>
          {userProfile && (
            <Box display="flex" sx={{ mt: 1 }}>
              <Avatar alt={userProfile?.username} src={userProfile?.avatar} />
              <Link
                href={appRoutes.users.view.path(collection.userId)}
                passHref
              >
                <Button sx={{ ml: 1 }} color="secondary">
                  {userProfile?.username ?? 'View user'}
                </Button>
              </Link>
            </Box>
          )}
        </Grid>
      )}
      <Grid item xs={12}>
        {renderContent()}
      </Grid>
    </Grid>
  );
};

export default withLayout(withUser(ViewCollection, { isPublic: true }), {
  isPublicPage: true,
});

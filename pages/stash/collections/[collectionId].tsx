/* eslint-disable @next/next/no-img-element */

import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenteredLoadingIndicator from '../../../components/shared/CenteredLoadingIndicator';
import CenteredMessage from '../../../components/shared/CenteredMessage';
import CollectionTabProvider from '../../../components/collections/view/CollectionTabContext';
import Link from 'next/link';
import React from 'react';
import ViewCollectionTabs from '../../../components/collections/view/ViewCollectionTabs';
import { getCollectionCoverImageUrl } from '../../../lib/constants/images';
import { getStringFromStringOrArray } from '../../../lib/helpers/stringHelpers';
import { useGetCollectionQuery } from '../../../lib/queries/collections/collectionQueries';
import { useGetItemsInCollectionQuery } from '../../../lib/queries/items/itemQueries';
import { useGetUserProfileQuery } from '../../../lib/queries/users/userQueries';
import { useRouter } from 'next/router';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';
import withLayout from '../../../lib/hoc/layout/withLayout';
import withUser from '../../../lib/hoc/withUser';

const ViewCollection = () => {
  const router = useRouter();
  const { authUser } = useUserContext();
  const {
    query: { collectionId },
  } = router;

  const { data: collection, isLoading: collectionLoading } =
    useGetCollectionQuery(
      getStringFromStringOrArray(collectionId),
      authUser?.uid,
    );

  const { data: collectionItems, isLoading: collectionItemsLoading } =
    useGetItemsInCollectionQuery(collection);
  const { data: userProfile, isLoading: userProfileLoading } =
    useGetUserProfileQuery(collection?.userId);

  const isOwner = collection?.userId === authUser?.uid;

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
            items={collectionItems ?? []}
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
        {authUser && (
          <Link href={'/stash/collections'} passHref>
            <Button startIcon={<ArrowBackIcon />} color="secondary">
              Back to collections
            </Button>
          </Link>
        )}
      </Grid>
      {!collectionLoading && collection && (
        <Grid item xs={12}>
          <Typography variant="h2" component="h1">
            {collection?.name ?? 'Collection'}
          </Typography>
          {userProfile && (
            <Box display="flex" sx={{ mt: 1 }}>
              <Avatar alt={userProfile?.username} src={userProfile?.avatar} />
              <Link href={`/users/${collection.userId}`} passHref>
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

export default withLayout(withUser(ViewCollection, { isPublic: true }));

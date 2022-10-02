/* eslint-disable @next/next/no-img-element */

import { Button, Grid, Typography } from '@mui/material';
import withUser, { useUserContext } from '../../../lib/hoc/withUser';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenteredLoadingIndicator from '../../../lib/components/shared/CenteredLoadingIndicator';
import CenteredMessage from '../../../lib/components/shared/CenteredMessage';
import CollectionTabProvider from '../../../lib/components/collections/view/CollectionTabContext';
import Link from 'next/link';
import React from 'react';
import ViewCollectionTabs from '../../../lib/components/collections/view/ViewCollectionTabs';
import { getCollectionCoverImageUrl } from '../../../lib/constants/images';
import { getStringFromStringOrArray } from '../../../lib/helpers/stringHelpers';
import { useGetCollectionQuery } from '../../../lib/queries/collections/collectionQueries';
import { useGetItemsInCollectionQuery } from '../../../lib/queries/items/itemQueries';
import { useRouter } from 'next/router';

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
        <Link href={'/stash/collections'} passHref>
          <Button startIcon={<ArrowBackIcon />}>Back to collections</Button>
        </Link>
      </Grid>
      {!collectionLoading && (
        <Grid item xs={12}>
          <Typography variant="h2" component="h1">
            {collection?.name ?? 'Collection'}
          </Typography>
          <Typography variant="subtitle1">
            by {isOwner ? 'me' : authUser?.uid}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        {renderContent()}
      </Grid>
    </Grid>
  );
};

export default withUser(ViewCollection);

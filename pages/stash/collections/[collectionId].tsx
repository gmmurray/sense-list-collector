/* eslint-disable @next/next/no-img-element */

import { Button, Grid, Typography } from '@mui/material';
import {
  ICollectionWithId,
  getMockCollection,
} from '../../../entities/collection';
import { IItemWithId, mockGetItemsInCollection } from '../../../entities/item';
import React, { useEffect, useState } from 'react';
import withUser, { useUserContext } from '../../../lib/hoc/withUser';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenteredLoadingIndicator from '../../../lib/components/shared/CenteredLoadingIndicator';
import CenteredMessage from '../../../lib/components/shared/CenteredMessage';
import CollectionTabProvider from '../../../lib/components/collections/view/CollectionTabContext';
import Link from 'next/link';
import ViewCollectionTabs from '../../../lib/components/collections/view/ViewCollectionTabs';
import { getCollectionCoverImageUrl } from '../../../lib/constants/images';
import { getStringFromStringOrArray } from '../../../lib/helpers/stringHelpers';
import { useRouter } from 'next/router';

const ViewCollection = () => {
  const router = useRouter();
  const { authUser } = useUserContext();
  const {
    query: { collectionId },
  } = router;
  const [collection, setCollection] = useState<ICollectionWithId | undefined>(
    undefined,
  );
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [collectionItems, setCollectionItems] = useState<IItemWithId[]>([]);
  const [collectionItemsLoading, setCollectionItemsLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady || !collectionId) return;

    const getCollection = async () => {
      setCollectionLoading(true);
      const res = await getMockCollection(
        getStringFromStringOrArray(collectionId),
      );
      setCollection(res);
      setCollectionLoading(false);
    };

    getCollection();
  }, [collectionId, router.isReady]);

  useEffect(() => {
    if (!collection?.itemIds.length) {
      setCollectionItems([]);
      return;
    }

    const getItems = async () => {
      setCollectionItemsLoading(true);
      const res = await mockGetItemsInCollection(collection.id);
      setCollectionItems(res);
      setCollectionItemsLoading(false);
    };

    getItems();
  }, [collection]);

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

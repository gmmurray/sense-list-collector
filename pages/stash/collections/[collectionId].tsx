import { Button, Grid, Typography } from '@mui/material';
import {
  ICollectionWithId,
  getMockCollection,
} from '../../../entities/collection';
import React, { useEffect, useState } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenteredLoadingIndicator from '../../../lib/components/shared/CenteredLoadingIndicator';
import CenteredMessage from '../../../lib/components/shared/CenteredMessage';
import Link from 'next/link';
import { getStringFromStringOrArray } from '../../../lib/helpers/stringHelpers';
import { useRouter } from 'next/router';

const ViewCollection = () => {
  const router = useRouter();
  const {
    query: { collectionId },
  } = router;
  const [collection, setCollection] = useState<ICollectionWithId | undefined>(
    undefined,
  );
  const [collectionLoading, setCollectionLoading] = useState(true);

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

  const renderContent = () => {
    if (collectionLoading) {
      return <CenteredLoadingIndicator />;
    } else if (!collection) {
      return <CenteredMessage message="Collection could not be found" />;
    }

    return (
      <div>
        <p>{collection.name}</p>
        <p>{collection.description}</p>
      </div>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Link href={'/stash/collections'} passHref>
          <Button startIcon={<ArrowBackIcon />}>Back to collections</Button>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2" component="h1">
          Collection
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {renderContent()}
      </Grid>
    </Grid>
  );
};

export default ViewCollection;

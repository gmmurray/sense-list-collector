import CenteredLoadingIndicator from '../shared/CenteredLoadingIndicator';
import CenteredMessage from '../shared/CenteredMessage';
import CollectionsListItem from './CollectionsListItem';
import CollectionsTable from './CollectionsTable';
import { Grid } from '@mui/material';
import { ICollectionWithId } from '../../entities/collection';
import React from 'react';

type CollectionsListProps = {
  collections: ICollectionWithId[];
  loading: boolean;
  isGridView?: boolean; // grid vs cards
};

const CollectionsList = ({
  collections,
  loading,
  isGridView = true,
}: CollectionsListProps) => {
  if (loading) {
    return <CenteredLoadingIndicator />;
  } else if (!collections || collections.length === 0) {
    return <CenteredMessage message="No collections found" />;
  }

  if (!isGridView) {
    return <CollectionsTable collections={collections} />;
  }

  return (
    <Grid container spacing={2}>
      {collections.map(c => (
        <Grid key={c.id} item xs={12} md={4}>
          <CollectionsListItem collection={c} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CollectionsList;

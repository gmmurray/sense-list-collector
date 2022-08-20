import React, { Fragment } from 'react';

import CenteredLoadingIndicator from '../shared/CenteredLoadingIndicator';
import { ICollectionWithId } from '../../../entities/collection';

type CollectionsListProps = {
  collections: ICollectionWithId[];
  loading: boolean;
  isGridView?: boolean; // grid vs cards
};

const CollectionsList = ({
  collections,
  loading,
  isGridView = false,
}: CollectionsListProps) => {
  if (loading) {
    return <CenteredLoadingIndicator />;
  }
  return (
    <Fragment>
      {collections.map(c => (
        <div key={c.id}>
          <p>{c.name}</p>
          <p>{c.description}</p>
          <p>{new Date(c.updatedAt).toLocaleString()}</p>
        </div>
      ))}
    </Fragment>
  );
};

export default CollectionsList;

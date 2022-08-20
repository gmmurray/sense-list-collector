import React, { Fragment } from 'react';

import CenteredLoadingIndicator from '../shared/CenteredLoadingIndicator';
import { IItemWithId } from '../../../entities/item';

type ItemsListProps = {
  items: IItemWithId[];
  loading: boolean;
  isGridView?: boolean;
};

const ItemsList = ({ items, loading, isGridView = false }: ItemsListProps) => {
  if (loading) {
    return <CenteredLoadingIndicator />;
  }
  return (
    <Fragment>
      {items.map(item => (
        <div key={item.id}>
          <p>{item.name}</p>
          <p>{item.description}</p>
          <p>{new Date(item.updatedAt).toLocaleString()}</p>
        </div>
      ))}
    </Fragment>
  );
};

export default ItemsList;

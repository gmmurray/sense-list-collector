import React, { PropsWithChildren, createContext, useContext } from 'react';

import { ICollectionWithId } from '../../../entities/collection';
import { IItemWithId } from '../../../entities/item';

type CollectionTabContextType = {
  collection?: ICollectionWithId;
  collectionLoading: boolean;
  items: IItemWithId[];
  itemsLoading: boolean;
  isOwner: boolean;
};

const initialValue: CollectionTabContextType = {
  collection: undefined,
  collectionLoading: false,
  items: [],
  itemsLoading: false,
  isOwner: false,
};

const CollectionTabContext = createContext(initialValue);

export const useCollectionTabContext = () => useContext(CollectionTabContext);

type CollectionTabProviderProps = {
  collection: ICollectionWithId;
  collectionLoading: boolean;
  items: IItemWithId[];
  itemsLoading: boolean;
  isOwner: boolean;
} & PropsWithChildren;

const CollectionTabProvider = ({
  collection,
  collectionLoading,
  items,
  itemsLoading,
  isOwner,
  children,
}: CollectionTabProviderProps) => {
  return (
    <CollectionTabContext.Provider
      value={{
        collection,
        collectionLoading,
        items,
        itemsLoading,
        isOwner,
      }}
    >
      {children}
    </CollectionTabContext.Provider>
  );
};

export default CollectionTabProvider;

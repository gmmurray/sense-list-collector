import { CollectionListState } from './useCollectionsList';
import Fuse from 'fuse.js';
import { ICollectionWithId } from '../../entities/collection';
import { getDateFromFirestoreTimestamp } from '../../lib/helpers/firestoreHelpers';
import { sort } from 'fast-sort';

const dateKeyLookup: { [x: string]: 'updatedAt' | 'createdAt' } = {
  'last updated': 'updatedAt',
  created: 'createdAt',
};

const sortCollectionList = (
  collections: ICollectionWithId[],
  options: CollectionListState,
): ICollectionWithId[] => {
  const { sortBy, sortOrder } = options;
  let sortFunc =
    sortOrder === 'asc' ? sort(collections).asc : sort(collections).desc;
  if (sortBy === 'privacy') {
    return sort(collections).by([
      // @ts-ignore
      { [sortOrder]: collection => (collection.isPublic ? 1 : 0) },
      { asc: collection => collection.name.toLocaleLowerCase() },
    ]);
  } else if (sortBy === 'items') {
    return sort(collections).by([
      //@ts-ignore
      { [sortOrder]: collection => collection.itemIds.length },
      { asc: collection => collection.name.toLocaleLowerCase() },
    ]);
  } else if (sortBy === 'last updated' || sortBy === 'created') {
    return sort(collections).by([
      //@ts-ignore
      {
        [sortOrder]: (collection: ICollectionWithId) =>
          getDateFromFirestoreTimestamp(collection[dateKeyLookup[sortBy]]),
      },
      { asc: collection => collection.name.toLocaleLowerCase() },
    ]);
  } else {
    return sortFunc(collection => collection[sortBy]?.toLocaleLowerCase());
  }
};

const filterCollectionList = (
  collections: ICollectionWithId[],
  options: CollectionListState,
): ICollectionWithId[] => {
  const { isPublicFilter, hasItemsFilter: itemsFilter } = options;
  return collections.filter(collection => {
    let include = true;

    if (isPublicFilter) {
      // undefined = any, true = only true, false = only false
      include = include && collection.isPublic;
    }

    if (isPublicFilter === false) {
      include = include && !collection.isPublic;
    }

    if (itemsFilter) {
      include = include && collection.itemIds.length > 0;
    } else if (itemsFilter === false) {
      include = include && collection.itemIds.length === 0;
    }

    return include;
  });
};

export const filterAndSortCollectionsList = (
  collections: ICollectionWithId[],
  options: CollectionListState,
) => {
  return sortCollectionList(
    filterCollectionList(collections, options),
    options,
  );
};

export const searchCollectionsList = (
  baseCollections: ICollectionWithId[],
  engine: Fuse<ICollectionWithId>,
  value?: string,
): ICollectionWithId[] =>
  value ? engine.search(value).map(item => item.item) : baseCollections;

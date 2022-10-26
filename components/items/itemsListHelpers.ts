import Fuse from 'fuse.js';
import { IItemWithId } from '../../entities/item';
import { ItemsListState } from './useItemsList';
import { getDateFromFirestoreTimestamp } from '../../lib/helpers/firestoreHelpers';
import { sort } from 'fast-sort';

const dateKeyLookup: { [x: string]: 'updatedAt' | 'createdAt' } = {
  'last updated': 'updatedAt',
  created: 'createdAt',
};

export const sortItemsList = (
  items: IItemWithId[],
  options: ItemsListState,
): IItemWithId[] => {
  const { sortBy, sortOrder } = options;
  let sortFunc = sortOrder === 'asc' ? sort(items).asc : sort(items).desc;

  let result: IItemWithId[] = [];
  switch (sortBy) {
    case 'category': {
      result = sort(items).by([
        // @ts-ignore
        { [sortOrder]: item => item.category?.toLocaleLowerCase() },
        { asc: item => item.name.toLocaleLowerCase() },
      ]);
      break;
    }
    case 'collections': {
      result = sort(items).by([
        // @ts-ignore
        { [sortOrder]: item => item.collectionIds.length },
        { asc: item => item.name.toLocaleLowerCase() },
      ]);
      break;
    }
    case 'last updated':
    case 'created': {
      result = sort(items).by([
        // @ts-ignore
        {
          [sortOrder]: (item: IItemWithId) =>
            getDateFromFirestoreTimestamp(item[dateKeyLookup[sortBy]]),
        },
        { asc: item => item.name.toLocaleLowerCase() },
      ]);
      break;
    }
    default: {
      result = sortFunc(item => item[sortBy]?.toLocaleLowerCase());
    }
  }

  return result;
};

export const filterItemsList = (
  items: IItemWithId[],
  options: ItemsListState,
) => {
  const {
    filter: { category, hasCollections },
  } = options;

  return items.filter(item => {
    let include = true;

    if (category) {
      if (category === 'none') {
        include = include && !item.category;
      } else {
        include = include && item.category === category;
      }
    }

    if (hasCollections) {
      include = include && item.collectionIds.length > 0;
    } else if (hasCollections === false) {
      include = include && item.collectionIds.length === 0;
    }

    return include;
  });
};

export const filterAndSortItemsList = (
  items: IItemWithId[],
  options: ItemsListState,
) => sortItemsList(filterItemsList(items, options), options);

export const searchItemsList = (
  baseList: IItemWithId[],
  engine: Fuse<IItemWithId>,
  value?: string,
): IItemWithId[] =>
  value ? engine.search(value).map(item => item.item) : baseList;

import { CollectionItemsListState } from './useCollectionItemsList';
import Fuse from 'fuse.js';
import { IItemWithId } from '../../../../entities/item';
import { getDateFromFirestoreTimestamp } from '../../../../lib/helpers/firestoreHelpers';
import { sort } from 'fast-sort';

const dateKeyLookup: { [x: string]: 'updatedAt' | 'createdAt' } = {
  'last updated': 'updatedAt',
  created: 'createdAt',
};

export const sortCollectionItemsList = (
  items: IItemWithId[],
  options: CollectionItemsListState,
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
    case `owner's choice`: {
      result = sortFunc(item => options.itemPositionMap.get(item.id));
      break;
    }
    default: {
      result = sortFunc(item => item[sortBy]?.toLocaleLowerCase());
    }
  }

  return result;
};

export const filterCollectionItemsList = (
  items: IItemWithId[],
  options: CollectionItemsListState,
) => {
  const {
    filter: { category },
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

    return include;
  });
};

export const filterAndSortCollectionItemsList = (
  items: IItemWithId[],
  options: CollectionItemsListState,
) =>
  sortCollectionItemsList(filterCollectionItemsList(items, options), options);

export const searchCollectionItemsList = (
  baseList: IItemWithId[],
  engine: Fuse<IItemWithId>,
  value?: string,
): IItemWithId[] =>
  value ? engine.search(value).map(item => item.item) : baseList;

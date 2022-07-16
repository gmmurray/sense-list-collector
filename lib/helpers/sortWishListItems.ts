import { IWishListItem } from '../../entities/wishList';
import { WishListItemsState } from '../types/wishListComponents';
import { sort } from 'fast-sort';

export const sortWishListItems = (
  items: IWishListItem[],
  options: WishListItemsState['listOptions'],
) => {
  const { sortBy, sortOrder } = options;
  let sortFunc = sortOrder === 'asc' ? sort(items).asc : sort(items).desc;
  if (sortBy === 'category') {
    return sort(items).by([
      // @ts-ignore
      { [sortOrder]: item => item.category?.toLocaleLowerCase() },
      { asc: item => item.name.toLocaleLowerCase() },
    ]);
  } else if (sortBy === 'price') {
    return sortFunc(item =>
      parseInt((item[sortBy] as IWishListItem['price']) ?? '0'),
    );
  } else if (sortBy === 'priority') {
    return sort(items).by([
      // @ts-ignore
      {
        [sortOrder]: (item: IWishListItem) => {
          if (item[sortBy] === 'low') {
            return 1;
          } else if (item[sortBy] === 'medium') {
            return 2;
          } else if (item[sortBy] === 'high') {
            return 3;
          } else {
            return undefined;
          }
        },
      },
      { asc: item => item.name.toLocaleLowerCase() },
    ]);
  } else {
    return sortFunc(item => item[sortBy]?.toLocaleLowerCase());
  }
};

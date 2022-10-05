import { IWishListItem } from '../../entities/wishList';
import { WishListItemsState } from '../types/wishListComponents';

export const filterWishListItems = (
  items: IWishListItem[],
  options: WishListItemsState['listOptions'],
) => {
  const { categoryFilter, priceFilter, priorityFilter, statusFilter } = options;
  return items.filter(item => {
    let include = true;

    if (statusFilter) {
      if (item.status === undefined) {
        return false;
      } else {
        include = include && item.status === statusFilter;
      }
    }

    if (categoryFilter) {
      if (categoryFilter === 'none') {
        include = include && !item.category;
      } else {
        include = include && item.category === categoryFilter;
      }
    }

    if (priceFilter) {
      if (item.price === undefined) {
        return false;
      } else {
        const priceValue = parseInt(item.price!);
        include = include && priceFilter > priceValue;
      }
    }

    if (priorityFilter) {
      if (!item.priority) {
        return false;
      } else {
        include = include && item.priority === priorityFilter;
      }
    }

    return include;
  });
};

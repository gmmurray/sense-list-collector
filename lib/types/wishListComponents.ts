import { IWishList, IWishListItem } from '../../entities/wishList';

import { SortDir } from './sort';

export const wishListItemSortOptions = [
  'name',
  'category',
  'price',
  'priority',
] as const;

export const baseCategoryFilters = ['none', 'all'];

export type WishListItemsState = {
  listId: string;
  editorOpen: boolean;
  editorLoading: boolean;
  editorInitialValue?: IWishListItem;
  itemsLoading: boolean;
  items: IWishListItem[];
  filteredItems: IWishListItem[];
  searchValue?: string;
  listOptions: {
    sortBy: typeof wishListItemSortOptions[number];
    sortOrder: SortDir;
    categoryFilter?: string;
    priceFilter?: number;
    priorityFilter?: IWishListItem['priority'];
    statusFilter?: IWishListItem['status'];
  };
  singleItemLoading?: string;
};

export type WishListItemsActions = {
  onEditorToggle?: (editorOpen: boolean, values?: IWishListItem) => void;
  onCreate?: (value: IWishListItem) => Promise<void>;
  onSave?: (id: string, value: IWishListItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onSearch?: (search?: string) => void;
  onSortChange?: (
    sortBy: WishListItemsState['listOptions']['sortBy'],
    sortOrder: WishListItemsState['listOptions']['sortOrder'],
  ) => void;
  onFilterChange?: (
    filter:
      | 'categoryFilter'
      | 'priceFilter'
      | 'priorityFilter'
      | 'statusFilter',
    value?: any,
  ) => void;
  onReset?: () => void;
  onItemStatusChange?: (
    id: string,
    status?: IWishListItem['status'],
  ) => Promise<void>;
};

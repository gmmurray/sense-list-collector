import { IWishListItem } from '../../entities/wishList';

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
    sortOrder: 'asc' | 'desc';
    categoryFilter?: string;
    priceFilter?: number;
    priorityFilter?: IWishListItem['priority'];
  };
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
    filter: 'categoryFilter' | 'priceFilter' | 'priorityFilter',
    value?: any,
  ) => void;
  onReset?: () => void;
};

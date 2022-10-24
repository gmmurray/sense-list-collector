import {
  WishListItemsActions,
  WishListItemsState,
} from '../../lib/types/wishListComponents';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useCreateWishListItemMutation,
  useDeleteWishListItemMutation,
  useUpdateWishListItemMutation,
  useUpdateWishListItemStatusMutation,
} from '../../lib/queries/wishList/wishListMutations';

import Fuse from 'fuse.js';
import { IWishListItem } from '../../entities/wishList';
import { filterWishListItems } from '../../lib/helpers/filterWishListItems';
import { sortWishListItems } from '../../lib/helpers/sortWishListItems';
import { useGetWishListItemsQuery } from '../../lib/queries/wishList/wishListQueries';
import { useSnackbarAlert } from '../shared/SnackbarAlert';
import { useUserContext } from '../../lib/hoc/withUser/userContext';

type WishListProviderProps = {} & React.PropsWithChildren;

const defaultWishListItemsState: WishListItemsState = {
  editorOpen: false,
  editorLoading: false,
  editorInitialValue: undefined,
  itemsLoading: true,
  items: [],
  filteredItems: [],
  searchValue: undefined,
  listOptions: {
    sortBy: 'name',
    sortOrder: 'asc',
    statusFilter: 'need',
  },
  singleItemLoading: undefined,
  conversionItem: undefined,
};

const defaultWishListItemsContextValue: WishListItemsState &
  WishListItemsActions = {
  ...defaultWishListItemsState,
};

export const WishListItemsContext = createContext(
  defaultWishListItemsContextValue,
);

export const useWishListItemsContext = () => useContext(WishListItemsContext);

let searchEngine: Fuse<IWishListItem>;

const filterThenSort = (
  items: IWishListItem[],
  options: WishListItemsState['listOptions'],
) => sortWishListItems(filterWishListItems(items, options), options);

export const WishListItemProvider = ({ children }: WishListProviderProps) => {
  const { documentUser } = useUserContext();
  const snackbarContext = useSnackbarAlert();

  const { data: wishListItems = [], isLoading: wishListItemsLoading } =
    useGetWishListItemsQuery(documentUser?.userId);

  const createWishListItemMutation = useCreateWishListItemMutation();
  const updateWishListItemMutation = useUpdateWishListItemMutation();
  const updateWishListItemStatusMutation =
    useUpdateWishListItemStatusMutation();
  const deleteWishListItemMutation = useDeleteWishListItemMutation();

  const [contextState, setContextState] = useState({
    ...defaultWishListItemsState,
  });

  useEffect(() => {
    if (documentUser && !documentUser.experience.hideWishListOwned) {
      setContextState(state => ({
        ...state,
        listOptions: { ...state.listOptions, statusFilter: undefined },
      }));
    }
  }, [documentUser]);

  useEffect(() => {
    searchEngine = new Fuse(wishListItems, {
      keys: ['name', 'description', 'category'],
    });

    setContextState(state => ({
      ...state,
      items: wishListItems,
      filteredItems: filterThenSort(wishListItems, state.listOptions),
    }));
  }, [wishListItems]);

  useEffect(
    () =>
      setContextState(state => ({
        ...state,
        itemsLoading:
          wishListItemsLoading ||
          createWishListItemMutation.isLoading ||
          updateWishListItemMutation.isLoading,
      })),
    [
      createWishListItemMutation.isLoading,
      updateWishListItemMutation.isLoading,
      wishListItemsLoading,
    ],
  );

  const handleEditorToggle = useCallback(
    (editorOpen: boolean, editorInitialValue?: IWishListItem) =>
      setContextState(state => ({ ...state, editorOpen, editorInitialValue })),
    [],
  );

  const handleCreateItem = useCallback(
    async (value: IWishListItem) => {
      if (!documentUser) return;

      try {
        await createWishListItemMutation.mutateAsync({
          value,
          userId: documentUser.userId,
        });
        setContextState(state => ({
          ...state,
          filteredItems: filterThenSort(state.items, state.listOptions),
          editorOpen: false,
        }));
        snackbarContext.send('Item created', 'success');
      } catch (error) {
        console.log(error);
        snackbarContext.send('Error creating item', 'error');
      }
    },
    [createWishListItemMutation, documentUser, snackbarContext],
  );

  const handleSaveItem = useCallback(
    async (value: IWishListItem) => {
      if (!documentUser) return;

      try {
        await updateWishListItemMutation.mutateAsync({
          value,
          userId: documentUser.userId,
        });
        setContextState(state => ({
          ...state,
          filteredItems: filterThenSort(state.items, state.listOptions),
          editorOpen: false,
          conversionItem:
            value.status === 'own'
              ? { item: value, includeDeletion: false }
              : undefined,
        }));
        snackbarContext.send('Item updated', 'success');
      } catch (error) {
        console.log(error);
        snackbarContext.send('Error updating item', 'error');
      }
    },
    [documentUser, snackbarContext, updateWishListItemMutation],
  );

  const handleUpdateItemStatus = useCallback(
    async (id: string, status: IWishListItem['status']) => {
      if (!documentUser) return;

      try {
        setContextState(state => ({
          ...state,
          singleItemLoading: id,
        }));
        await updateWishListItemStatusMutation.mutateAsync({
          id,
          userId: documentUser.userId,
          status,
        });

        setContextState(state => ({
          ...state,
          filteredItems: filterThenSort(state.items, state.listOptions),
          singleItemLoading: undefined,
          conversionItem:
            status === 'own'
              ? {
                  item: wishListItems.filter(item => item.id === id)[0],
                  includeDeletion: false,
                }
              : undefined,
        }));
        snackbarContext.send('Item status updated', 'success');
      } catch (error) {
        console.log(error);
        snackbarContext.send('Error updating item status', 'error');
      }
    },
    [
      documentUser,
      snackbarContext,
      updateWishListItemStatusMutation,
      wishListItems,
    ],
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      if (!documentUser) return;
      try {
        await deleteWishListItemMutation.mutateAsync({
          id,
          userId: documentUser.userId,
        });
        setContextState(state => ({
          ...state,
          filteredItems: filterThenSort(state.items, state.listOptions),
          editorOpen: false,
        }));
        snackbarContext.send('Item deleted', 'success');
      } catch (error) {
        console.log(error);
        snackbarContext.send('Error deleting item', 'error');
      }
    },
    [deleteWishListItemMutation, documentUser, snackbarContext],
  );

  const handleSearch = useCallback(
    (search?: string) => {
      let filteredItems: IWishListItem[];
      if (!search) {
        filteredItems = contextState.items;
      } else {
        filteredItems = searchEngine.search(search).map(item => item.item);
      }

      setContextState(state => ({
        ...state,
        searchValue: search,
        filteredItems: filterThenSort(filteredItems, state.listOptions),
      }));
    },
    [contextState.items],
  );

  const handleSortChange = useCallback(
    (
      sortBy: WishListItemsState['listOptions']['sortBy'],
      sortOrder: WishListItemsState['listOptions']['sortOrder'],
    ) => {
      setContextState(state => ({
        ...state,
        filteredItems: filterThenSort(state.filteredItems, {
          ...state.listOptions,
          sortBy,
          sortOrder,
        }),
        listOptions: {
          ...state.listOptions,
          sortBy,
          sortOrder,
        },
      }));
    },
    [],
  );

  const handleFilterChange = useCallback(
    (
      filter:
        | 'categoryFilter'
        | 'priceFilter'
        | 'priorityFilter'
        | 'statusFilter',
      value?: any,
    ) => {
      setContextState(state => ({
        ...state,
        filteredItems: filterThenSort(
          state.searchValue
            ? searchEngine.search(state.searchValue).map(item => item.item)
            : state.items,
          {
            ...state.listOptions,
            [filter]: value,
          },
        ),
        listOptions: {
          ...state.listOptions,
          [filter]: value,
        },
      }));
    },
    [],
  );

  const handleReset = useCallback(() => {
    const statusFilter =
      documentUser?.experience.hideWishListOwned === false
        ? undefined
        : defaultWishListItemsState.listOptions.statusFilter;
    setContextState(state => ({
      ...state,
      searchValue: defaultWishListItemsState.searchValue,
      listOptions: { ...defaultWishListItemsState.listOptions, statusFilter },
      filteredItems: filterThenSort(state.items, {
        ...defaultWishListItemsState.listOptions,
        statusFilter,
      }),
    }));
  }, [documentUser?.experience.hideWishListOwned]);

  const handleConversionItemChange = useCallback(
    (conversionItem: WishListItemsState['conversionItem']) =>
      setContextState(state => ({ ...state, conversionItem })),
    [],
  );

  const value: WishListItemsState & WishListItemsActions = {
    ...contextState,
    onEditorToggle: handleEditorToggle,
    onCreate: handleCreateItem,
    onSave: handleSaveItem,
    onDelete: handleDeleteItem,
    onSearch: handleSearch,
    onSortChange: handleSortChange,
    onFilterChange: handleFilterChange,
    onReset: handleReset,
    onItemStatusChange: handleUpdateItemStatus,
    onConversionItemChange: handleConversionItemChange,
  };

  return (
    <WishListItemsContext.Provider value={value}>
      {children}
    </WishListItemsContext.Provider>
  );
};

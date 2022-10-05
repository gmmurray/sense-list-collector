import {
  WISH_LIST_COLLECTION,
  WISH_LIST_ITEMS_COLLECTION,
} from '../../constants/collections';
import {
  WishListItemsActions,
  WishListItemsState,
} from '../../types/wishListComponents';
import {
  collection,
  deleteDoc,
  doc,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import Fuse from 'fuse.js';
import { IWishListItem } from '../../../entities/wishList';
import { filterWishListItems } from '../../helpers/filterWishListItems';
import { firebaseDB } from '../../../config/firebase';
import { sanitizeInputs } from '../../helpers/sanitizeInputs';
import { sortWishListItems } from '../../helpers/sortWishListItems';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useSnackbarAlert } from '../shared/SnackbarAlert';

const getCollection = (id: string) =>
  collection(firebaseDB, WISH_LIST_COLLECTION, id, WISH_LIST_ITEMS_COLLECTION);

type WishListProviderProps = {
  listId: string;
} & React.PropsWithChildren;

const defaultWishListItemsState: WishListItemsState = {
  listId: '',
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

export const WishListItemProvider = ({
  listId,
  children,
}: WishListProviderProps) => {
  const [contextState, setContextState] = useState({
    ...defaultWishListItemsState,
    listId,
  });

  const [queryResult, queryLoading, queryError] = useCollection(
    query(getCollection(listId)),
  );

  const snackbarContext = useSnackbarAlert();

  useEffect(() => {
    if (!queryResult) return;

    const items = (queryResult?.docs ?? []).map(
      item =>
        ({
          ...item.data(),
          id: item.id,
        } as IWishListItem),
    );

    searchEngine = new Fuse(items, {
      keys: ['name', 'description', 'category'],
    });

    setContextState(state => ({
      ...state,
      items,
      filteredItems: filterThenSort(items, state.listOptions),
    }));
  }, [queryResult]);

  useEffect(
    () => setContextState(state => ({ ...state, itemsLoading: queryLoading })),
    [queryLoading],
  );

  useEffect(() => {
    if (queryError && snackbarContext.message !== queryError.message) {
      snackbarContext.send(queryError.message, 'error');
    }
  }, [queryError, snackbarContext]);

  const handleEditorToggle = useCallback(
    (editorOpen: boolean, editorInitialValue?: IWishListItem) =>
      setContextState(state => ({ ...state, editorOpen, editorInitialValue })),
    [],
  );

  const handleCreateItem = useCallback(
    async (value: IWishListItem) => {
      setContextState(state => ({
        ...state,
        editorLoading: true,
      }));

      const sanitizedValues = sanitizeInputs(value);
      const ref = doc(getCollection(contextState.listId));

      await setDoc(ref, { ...sanitizedValues });
      setContextState(state => ({
        ...state,
        filteredItems: filterThenSort(state.items, state.listOptions),
        editorLoading: false,
        editorOpen: false,
      }));
      snackbarContext.send('Item created', 'success');
    },
    [contextState.listId, snackbarContext],
  );

  const handleSaveItem = useCallback(
    async (id: string, value: IWishListItem) => {
      setContextState(state => ({
        ...state,
        editorLoading: true,
      }));

      const ref = doc(getCollection(contextState.listId), id);

      await updateDoc(ref, { ...value });

      setContextState(state => ({
        ...state,
        filteredItems: filterThenSort(state.items, state.listOptions),
        editorLoading: false,
        editorOpen: false,
      }));
      snackbarContext.send('Item saved', 'success');
    },
    [contextState.listId, snackbarContext],
  );

  const handleUpdateItemStatus = useCallback(
    async (id: string, status: IWishListItem['status']) => {
      const oldValues = contextState.items.filter(item => item.id === id)[0];
      if (!oldValues) return;

      setContextState(state => ({
        ...state,
        singleItemLoading: id,
      }));

      const ref = doc(getCollection(contextState.listId), id);

      await updateDoc(ref, { ...oldValues, status });

      setContextState(state => ({
        ...state,
        filteredItems: filterThenSort(state.items, state.listOptions),
        singleItemLoading: undefined,
      }));
      snackbarContext.send('Item updated', 'success');
    },
    [contextState.items, contextState.listId, snackbarContext],
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      setContextState(state => ({
        ...state,
        editorLoading: true,
      }));

      const ref = doc(getCollection(contextState.listId), id);

      await deleteDoc(ref);

      setContextState(state => ({
        ...state,
        filteredItems: filterThenSort(state.items, state.listOptions),
        editorLoading: false,
        editorOpen: false,
      }));
      snackbarContext.send('Item deleted', 'info');
    },
    [contextState.listId, snackbarContext],
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
    setContextState(state => ({
      ...state,
      searchValue: defaultWishListItemsState.searchValue,
      listOptions: { ...defaultWishListItemsState.listOptions },
      filteredItems: filterThenSort(
        state.items,
        defaultWishListItemsState.listOptions,
      ),
    }));
  }, []);

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
  };

  return (
    <WishListItemsContext.Provider value={value}>
      {children}
    </WishListItemsContext.Provider>
  );
};

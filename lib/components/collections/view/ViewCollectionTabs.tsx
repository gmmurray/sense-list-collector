import React, { useCallback, useEffect, useMemo } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import CollectionDashboardTab from './CollectionDashboardTab';
import CollectionItemsTab from './itemsTab/CollectionItemsTab';
import CollectionSettingsTab from './CollectionSettingsTab';
import { Tab } from '@mui/material';
import { getStringFromStringOrArray } from '../../../helpers/stringHelpers';
import { useCollectionTabContext } from './CollectionTabContext';
import { useRouter } from 'next/router';
import { useUserContext } from '../../../hoc/withUser';

const tabLookup: Record<
  string,
  {
    name: string;
    component: () => JSX.Element | null;
    requiresAuth: boolean;
  }
> = {
  ['1']: {
    name: 'Dashboard',
    component: CollectionDashboardTab,
    requiresAuth: false,
  },
  ['2']: {
    name: 'Items',
    component: CollectionItemsTab,
    requiresAuth: false,
  },
  ['3']: {
    name: 'Settings',
    component: CollectionSettingsTab,
    requiresAuth: true,
  },
};

const ViewCollectionTabs = () => {
  const router = useRouter();
  const { authUser } = useUserContext();
  const { collection } = useCollectionTabContext();

  const filteredTabLookup = useMemo(() => {
    if (!(authUser && collection && authUser.uid === collection.userId)) {
      const keys = Object.keys(tabLookup).filter(
        key => !tabLookup[key as keyof typeof tabLookup].requiresAuth,
      );

      const result = {} as typeof tabLookup;
      keys.forEach(key => (result[key] = { ...tabLookup[key] }));

      return result;
    }

    return tabLookup;
  }, [collection, authUser]);

  const currentTab = router.query.tab
    ? getStringFromStringOrArray(router.query.tab)
    : '1';

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newTab: string) => {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, tab: newTab },
      });
    },
    [router],
  );

  // make sure tab query value is valid
  useEffect(() => {
    if (
      router.isReady &&
      (!router.query.tab ||
        !Object.keys(filteredTabLookup).some(
          key => key === getStringFromStringOrArray(router.query.tab),
        ))
    ) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          tab: Object.keys(filteredTabLookup)[0],
        },
      });
    }
  }, [filteredTabLookup, router]);

  return (
    <TabContext value={currentTab}>
      <TabList
        onChange={handleTabChange}
        allowScrollButtonsMobile
        variant="scrollable"
      >
        {Object.keys(filteredTabLookup).map(key => (
          <Tab
            key={key}
            label={
              filteredTabLookup[key as keyof typeof filteredTabLookup].name
            }
            value={key}
          />
        ))}
      </TabList>
      {Object.keys(filteredTabLookup).map(key => {
        const Component =
          filteredTabLookup[key as keyof typeof filteredTabLookup].component;
        return (
          <TabPanel key={key} value={key}>
            <Component />
          </TabPanel>
        );
      })}
    </TabContext>
  );
};

export default ViewCollectionTabs;

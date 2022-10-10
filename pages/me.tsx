import React from 'react';
import ResponsiveTabPage from '../lib/components/shared/ResponsiveTabPage';
import UserPreferencesPage from '../lib/components/me/userPreferencesPage/UserPreferencesPage';
import UserProfilePage from '../lib/components/me/userProfilePage/UserProfilePage';
import withUser from '../lib/hoc/withUser';

const pages = [
  {
    component: <UserProfilePage />,
    tabLabel: 'Profile',
    pageLabel: 'Public profile',
  },
  { component: <UserPreferencesPage />, tabLabel: 'Preferences' },
];

const UserSettingsPage = () => {
  return <ResponsiveTabPage pages={pages} />;
};

export default withUser(UserSettingsPage);

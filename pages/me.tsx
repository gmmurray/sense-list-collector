import React from 'react';
import ResponsiveTabPage from '../components/shared/ResponsiveTabPage';
import UserPreferencesPage from '../components/me/userPreferencesPage/UserPreferencesPage';
import UserProfilePage from '../components/me/userProfilePage/UserProfilePage';
import withLayout from '../lib/hoc/layout/withLayout';
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

export default withLayout(withUser(UserSettingsPage));

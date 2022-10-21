import React from 'react';
import ResponsiveTabPage from '../components/shared/ResponsiveTabPage';
import UserPreferencesPage from '../components/me/userPreferencesPage/UserPreferencesPage';
import UserProfilePage from '../components/me/userProfilePage/UserProfilePage';
import { appRoutes } from '../lib/constants/routes';
import usePageTitle from '../lib/hooks/usePageTitle';
import { useRouter } from 'next/router';
import { useUserContext } from '../lib/hoc/withUser/userContext';
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
  const router = useRouter();
  const { documentUser } = useUserContext();

  usePageTitle(appRoutes.me.title(documentUser?.profile?.username));

  if (!documentUser) {
    router.push(appRoutes.auth.path);
  }
  return <ResponsiveTabPage pages={pages} />;
};

export default withLayout(withUser(UserSettingsPage));

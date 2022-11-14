import { appRoutes } from '../../../lib/constants/routes';

export type linkType = {
  name: string;
  to: string;
  auth: boolean;
  active: (route: string) => boolean;
  children?: linkType[];
};

export const navbarLinks: linkType[] = [
  {
    name: 'Explore',
    to: appRoutes.explore.path,
    auth: false,
    active: route => route.includes(appRoutes.explore.path),
  },
  {
    name: 'Stash',
    to: appRoutes.stash.path,
    auth: true,
    active: route => route.includes(appRoutes.stash.path),
    children: [
      {
        name: 'Home',
        to: appRoutes.stash.path,
        auth: true,
        active: route => route === appRoutes.stash.path,
      },
      {
        name: 'Collections',
        to: appRoutes.stash.collections.path(),
        auth: true,
        active: route => route.includes(appRoutes.stash.collections.path()),
      },
      {
        name: 'Items',
        to: appRoutes.stash.items.path(),
        auth: true,
        active: route => route.includes(appRoutes.stash.items.path()),
      },
    ],
  },
  {
    name: 'Wish List',
    to: appRoutes.wishList.path,
    auth: true,
    active: route => route.includes(appRoutes.wishList.path),
  },
];

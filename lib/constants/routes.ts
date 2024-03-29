const PAGE_TITLE_SUFFIX = ' - Collectionist';

const createPageTitle = (title: string) => title + PAGE_TITLE_SUFFIX;

export const createQueryRoute = (route: string, query: Record<string, any>) =>
  `${route}?${new URLSearchParams(query).toString()}`;

export const appRoutes = {
  landing: {
    path: '/' as const,
    title: createPageTitle('Share, Manage Plan, Collect.'),
  },
  home: {
    path: '/home' as const,
    title: createPageTitle('Home'),
  },
  explore: {
    path: '/explore' as const,
    title: createPageTitle('Explore'),
    query: {
      userId: (userId: string) =>
        createQueryRoute(appRoutes.explore.path, { userId }),
    },
  },
  stash: {
    path: '/stash' as const,
    title: createPageTitle('Stash'),
    collections: {
      path: () => appRoutes.stash.path + '/collections',
      title: createPageTitle('Collections'),
      new: {
        path: () => appRoutes.stash.collections.path() + '/new',
        title: createPageTitle('New collection'),
      },
      view: {
        path: (id: string) => appRoutes.stash.collections.path() + `/${id}`,
        title: (name?: string) => createPageTitle(name ?? 'View collection'),
        query: {
          tab: (collectionId: string, tab: string) =>
            createQueryRoute(
              appRoutes.stash.collections.view.path(collectionId),
              { tab },
            ),
        },
      },
    },
    items: {
      path: () => appRoutes.stash.path + '/items',
      title: createPageTitle('Items'),
      new: {
        path: () => appRoutes.stash.items.path() + '/new',
        title: createPageTitle('New item'),
        query: {
          collectionId: (collectionId: string) =>
            createQueryRoute(appRoutes.stash.items.new.path(), {
              collectionId,
            }),
        },
      },
      view: {
        path: (id: string) => appRoutes.stash.items.path() + `/${id}`,
        title: (name?: string) => createPageTitle(name ?? 'View item'),
      },
    },
  },
  wishList: {
    path: '/wish-list' as const,
    title: createPageTitle('Wish list'),
  },
  me: {
    path: '/me' as const,
    title: (username?: string) => createPageTitle(username ?? 'My settings'),
  },
  users: {
    path: '/users' as const,
    view: {
      path: (id: string) => appRoutes.users.path + `/${id}`,
      title: (username?: string) => createPageTitle(username ?? 'View user'),
    },
  },
  auth: {
    path: '/auth' as const,
    title: createPageTitle('Get started'),
    query: {
      redirectTo: (redirectTo?: string) =>
        redirectTo
          ? createQueryRoute(appRoutes.auth.path, { redirectTo })
          : appRoutes.auth.path,
    },
  },
};

import {
  Avatar,
  Chip,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  COLLECTION_SEARCH_PAGE_SIZE,
  ICollectionWithProfile,
} from '../entities/collection';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  collectionQueryKeys,
  useSearchCollectionQuery,
} from '../lib/queries/collections/collectionQueries';

import CenteredLoadingIndicator from '../components/shared/CenteredLoadingIndicator';
import CenteredMessage from '../components/shared/CenteredMessage';
import CheckIcon from '@mui/icons-material/Check';
import ConditionalTooltip from '../components/shared/ConditionalTooltip';
import { ICollectionSearchOptions } from '../lib/types/collectionSearchTypes';
import Link from 'next/link';
import { LoadingButton } from '@mui/lab';
import { appRoutes } from '../lib/constants/routes';
import { getCollectionCoverImageUrl } from '../lib/constants/images';
import { getStringFromStringOrArray } from '../lib/helpers/stringHelpers';
import { reactQueryClient } from '../config/reactQuery';
import { uniqueElements } from '../lib/helpers/arrayHelpers';
import usePageTitle from '../lib/hooks/usePageTitle';
import { useRouter } from 'next/router';
import withLayout from '../lib/hoc/layout/withLayout';
import withUser from '../lib/hoc/withUser';

const ExplorePage = () => {
  usePageTitle(appRoutes.explore.title);
  const router = useRouter();
  const [searchSettings, setSearchSettings] =
    useState<ICollectionSearchOptions>({});
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [allCollections, setAllCollections] = useState<
    ICollectionWithProfile[]
  >([]);
  const {
    data: additionalCollections,
    isLoading: additionalCollectionsLoading,
  } = useSearchCollectionQuery(searchSettings);

  const [userOptionsMenuAnchor, setUserOptionsMenuAnchor] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    if (additionalCollections && !additionalCollectionsLoading) {
      if (additionalCollections.data.length < COLLECTION_SEARCH_PAGE_SIZE) {
        setCanLoadMore(false);
      }
      setAllCollections(state => [
        ...state,
        ...additionalCollections.data.filter(
          c => !state.some(s => s.id === c.id),
        ),
      ]);
    }
  }, [additionalCollections, additionalCollectionsLoading]);

  const handleLoadMore = useCallback(() => {
    if (!additionalCollections) return;

    setSearchSettings(state => ({
      ...state,
      lastElement: additionalCollections.lastElement,
    }));
  }, [additionalCollections]);

  useEffect(() => {
    if (router.isReady && router.query.userId) {
      setSearchSettings(state => ({
        ...state,
        userId: getStringFromStringOrArray(router.query.userId),
      }));
    }
  }, [router.isReady, router.query.userId]);

  const handleToggleItemsFilter = useCallback(() => {
    setSearchSettings(state => ({ ...state, hasItems: !state.hasItems }));
    setAllCollections([]);
  }, []);

  const handleOpenUserOptionsMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setUserOptionsMenuAnchor(event.currentTarget);
    },
    [],
  );

  const handleCloseUserOptionsMenu = useCallback(() => {
    setUserOptionsMenuAnchor(null);
  }, []);

  const handleUserFilterClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (searchSettings.userId) {
        setSearchSettings(state => ({ ...state, userId: undefined }));
      } else {
        handleOpenUserOptionsMenu(event);
      }
    },
    [handleOpenUserOptionsMenu, searchSettings.userId],
  );

  const handleUserOptionClick = useCallback(
    (userId: string) => {
      setSearchSettings(state => ({ ...state, userId }));
      setAllCollections([]);
      handleCloseUserOptionsMenu();
    },
    [handleCloseUserOptionsMenu],
  );

  const reset = () => {
    setAllCollections([]);
    setSearchSettings({});
    reactQueryClient.invalidateQueries(collectionQueryKeys.search({}));
  };

  const uniqueUserIds = uniqueElements(allCollections.map(c => c.userId));
  const profileMap = new Map(
    allCollections.filter(c => !!c.profile).map(c => [c.userId, c.profile]),
  );
  // const userProfileOptions = [];
  // allCollections.forEach()
  // allCollections.map((c) => {
  //   if (c.profile)
  //     return { ...c.profile, userId: c.userId };
  // });

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">
            Explore some recently updated collections
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1}>
                  <Chip
                    icon={searchSettings.hasItems ? <CheckIcon /> : undefined}
                    label="1 or more items"
                    onClick={handleToggleItemsFilter}
                    color={searchSettings.hasItems ? 'secondary' : 'default'}
                  />
                  {(profileMap.size > 0 || !!searchSettings.userId) && (
                    <ConditionalTooltip
                      title={
                        searchSettings.userId
                          ? profileMap.get(searchSettings?.userId)?.username
                          : searchSettings.userId
                      }
                      visible={!!searchSettings.userId}
                    >
                      <Chip
                        icon={searchSettings.userId ? <CheckIcon /> : undefined}
                        label="Specific user"
                        onClick={handleUserFilterClick}
                        color={searchSettings.userId ? 'secondary' : 'default'}
                      />
                    </ConditionalTooltip>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <List>
                  {allCollections.map((c, index) => (
                    <Fragment key={c.id}>
                      <Fade in timeout={500}>
                        <ListItem
                          alignItems="flex-start"
                          secondaryAction={
                            c.profile ? (
                              <Link
                                href={appRoutes.users.view.path(c.userId)}
                                passHref
                              >
                                <Tooltip title={c.profile?.username}>
                                  <IconButton>
                                    <Avatar src={c.profile?.avatar} />
                                  </IconButton>
                                </Tooltip>
                              </Link>
                            ) : undefined
                          }
                          disablePadding
                        >
                          <Link
                            href={appRoutes.stash.collections.view.path(c.id)}
                            passHref
                          >
                            <ListItemButton>
                              <ListItemAvatar>
                                <Avatar
                                  alt={c.name}
                                  src={getCollectionCoverImageUrl(c)}
                                  sx={{ height: 56 }}
                                  imgProps={{ sx: { objectFit: 'contain' } }}
                                  variant="square"
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={c.name}
                                secondary={`${c.itemIds.length} item(s)`}
                                secondaryTypographyProps={{
                                  sx: {
                                    overflow: 'hidden',
                                    maxWidth: '90%',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  },
                                }}
                              />
                            </ListItemButton>
                          </Link>
                        </ListItem>
                      </Fade>
                      {index < allCollections.length - 1 && <Divider />}
                    </Fragment>
                  ))}
                </List>
              </Grid>
              {allCollections.length > 0 && (
                <Grid item xs={12} textAlign="center">
                  <LoadingButton
                    loading={additionalCollectionsLoading}
                    onClick={handleLoadMore}
                    disabled={!canLoadMore}
                  >
                    More
                  </LoadingButton>
                </Grid>
              )}
              {allCollections.length === 0 && additionalCollectionsLoading && (
                <Grid item xs={12}>
                  <CenteredLoadingIndicator />
                </Grid>
              )}
              {allCollections.length === 0 && !additionalCollectionsLoading && (
                <Grid item xs={12}>
                  <CenteredMessage message="No collections found" />
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Menu
        anchorEl={userOptionsMenuAnchor}
        open={!!userOptionsMenuAnchor}
        onClose={handleCloseUserOptionsMenu}
      >
        {Array.from(profileMap.entries()).map(kvp => (
          <MenuItem key={kvp[0]} onClick={() => handleUserOptionClick(kvp[0])}>
            {kvp[1]?.username ?? kvp[0]}
          </MenuItem>
        ))}
      </Menu>
    </Container>
  );
};

export default withLayout(
  withUser(ExplorePage, {
    isPublic: true,
  }),
);

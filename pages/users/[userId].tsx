import {
  Avatar,
  Grid,
  Link as MUILink,
  Paper,
  Typography,
} from '@mui/material';
import {
  getStringFromStringOrArray,
  stringHasValue,
} from '../../lib/helpers/stringHelpers';

import CenteredLoadingIndicator from '../../components/shared/CenteredLoadingIndicator';
import CenteredMessage from '../../components/shared/CenteredMessage';
import Link from 'next/link';
import React from 'react';
import { USER_PAGE_COLLECTION_LIMIT } from '../../entities/user';
import { appRoutes } from '../../lib/constants/routes';
import { useGetUserProfilePageQuery } from '../../lib/queries/users/userQueries';
import usePageTitle from '../../lib/hooks/usePageTitle';
import { useRouter } from 'next/router';
import withLayout from '../../lib/hoc/layout/withLayout';

const UserProfilePage = () => {
  const router = useRouter();
  const { data: queryResult, isLoading } = useGetUserProfilePageQuery(
    getStringFromStringOrArray(router.query.userId),
  );

  usePageTitle(appRoutes.users.view.title(queryResult?.profile.username));

  if (isLoading) return <CenteredLoadingIndicator />;

  if (!queryResult) return <CenteredMessage message="User not found" />;

  const collectionCountString =
    queryResult.collectionCount >= USER_PAGE_COLLECTION_LIMIT
      ? `${USER_PAGE_COLLECTION_LIMIT}+`
      : queryResult.collectionCount.toString();

  return (
    <Paper sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} container spacing={2}>
          <Grid item>
            <Avatar
              sx={{ width: '15vw', height: '15vw' }}
              src={queryResult.profile.avatar}
            />
          </Grid>
          <Grid item>
            <Typography variant="h2">{queryResult.profile.username}</Typography>
            <Link
              href={appRoutes.explore.query.userId(queryResult.userId)}
              passHref
            >
              <MUILink color="secondary" underline="hover">
                Explore
              </MUILink>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="overline">Joined</Typography>
            <Typography variant="body1">
              {queryResult.createdAt.toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
        {stringHasValue(queryResult.profile.bio) && (
          <Grid item xs={12}>
            <Typography variant="overline">Bio</Typography>
            <Typography variant="body1">{queryResult.profile.bio}</Typography>
          </Grid>
        )}
        <Grid item xs={6}>
          <Link href={appRoutes.stash.collections.path()} passHref>
            <MUILink color="inherit" underline="hover">
              <Typography
                variant="overline"
                sx={
                  {
                    // ':hover': {
                    //   textDecoration: 'underline',
                    //   cursor: 'pointer',
                    // },
                  }
                }
              >
                Collections
              </Typography>
            </MUILink>
          </Link>
          <Typography variant="body1">{collectionCountString}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="overline">Items</Typography>
          <Typography variant="body1">{queryResult.itemCount}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withLayout(UserProfilePage);

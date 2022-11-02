import {
  Box,
  Button,
  Fade,
  IconButton,
  List,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import {
  useCreateCollectionCommentMutation,
  useDeleteCollectionCommentMutation,
  useUpdateCollectionCommentLikesMutation,
} from '../../../../lib/queries/collectionComments/collectionCommentMutations';

import Avatar from '@mui/material/Avatar';
import { COLLECTION_COMMENT_MAX_LENGTH } from '../../../../entities/collectionComments';
import CenteredLoadingIndicator from '../../../shared/CenteredLoadingIndicator';
import ConditionalTooltip from '../../../shared/ConditionalTooltip';
import DashboardCard from './DashboardCard';
import { ICollectionWithId } from '../../../../entities/collection';
import { IUserProfileWithUserId } from '../../../../entities/user';
import LikeIndicator from '../../../shared/LikeIndicator';
import Link from 'next/link';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactTimeago from 'react-timeago';
import { appRoutes } from '../../../../lib/constants/routes';
import { getDateFromFirestoreTimestamp } from '../../../../lib/helpers/firestoreHelpers';
import { uniqueElements } from '../../../../lib/helpers/arrayHelpers';
import { useGetCommentsForCollectionQuery } from '../../../../lib/queries/collectionComments/collectionCommentQueries';
import { useGetUserProfilesQueries } from '../../../../lib/queries/users/userQueries';
import { useSnackbarAlert } from '../../../shared/SnackbarAlert';
import { useUserContext } from '../../../../lib/hoc/withUser/userContext';

type Props = {
  collection: ICollectionWithId;
};

export default function DashboardCommentsCard(props: Props) {
  const { documentUser } = useUserContext();
  const snackbar = useSnackbarAlert();
  const { data: comments = [], isLoading: commentsLoading } =
    useGetCommentsForCollectionQuery(props.collection.id);

  const createCommentMutation = useCreateCollectionCommentMutation(
    props.collection.id,
  );
  const updateLikesMutation = useUpdateCollectionCommentLikesMutation(
    props.collection.id,
  );
  const deleteCommentMutation = useDeleteCollectionCommentMutation(
    props.collection.id,
  );

  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentValidation, setCommentValidation] = useState<string | null>(
    null,
  );

  const [uniqueProfileIds, setUniqueProfileIds] = useState<string[]>([]);
  const userProfileResults = useGetUserProfilesQueries(uniqueProfileIds);

  const [commentMenu, setCommentMenu] = useState<{
    anchor: HTMLElement;
    userId: string;
    commentId: string;
  } | null>(null);

  useEffect(() => {
    const uniqueIds = uniqueElements(comments.map(c => c.userId));
    if (uniqueIds.length) {
      setUniqueProfileIds(uniqueIds);
    }
  }, [comments]);

  const handleInputFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsCommenting(true);
    },
    [],
  );

  const handleNewCommentClose = useCallback(() => {
    setIsCommenting(false);
    setCommentValidation(null);
    setNewComment('');
  }, []);

  const handleCreateComment = useCallback(async () => {
    if (commentValidation || !documentUser) return;
    try {
      await createCommentMutation.mutateAsync(
        {
          userId: documentUser.userId,
          content: newComment,
          createdAt: new Date(),
          likedByUserIds: [],
        },
        {
          onSuccess: () => handleNewCommentClose(),
        },
      );
    } catch (error) {
      console.log(error);
      snackbar.send('Error saving comment', 'error');
    }
  }, [
    commentValidation,
    createCommentMutation,
    documentUser,
    handleNewCommentClose,
    newComment,
    snackbar,
  ]);

  useEffect(() => {
    let validation = null;
    if (newComment.length >= COLLECTION_COMMENT_MAX_LENGTH) {
      validation = `Comment must be less than ${COLLECTION_COMMENT_MAX_LENGTH} characters`;
    }
    setCommentValidation(validation);
  }, [newComment.length]);

  const canLike = !!documentUser;

  const handleLikeComment = useCallback(
    async (commentId: string, isAdditive: boolean) => {
      if (!canLike) return;
      try {
        await updateLikesMutation.mutateAsync({
          commentId,
          userId: documentUser.userId,
          isAdditive,
        });
      } catch (error) {
        console.log(error);
        snackbar.send('Error updating likes', 'error');
      }
    },
    [canLike, documentUser, snackbar, updateLikesMutation],
  );

  const canDelete = useCallback(
    (commentingUserId?: string) => {
      if (!documentUser || !commentingUserId) return false;

      return (
        documentUser.userId === props.collection.userId ||
        documentUser.userId === commentingUserId
      );
    },
    [documentUser, props.collection.userId],
  );

  const handleDeleteComment = useCallback(
    async (commentId?: string, commentingUserId?: string) => {
      if (!documentUser || !commentId || !canDelete(commentingUserId)) return;
      setCommentMenu(null);
      try {
        await deleteCommentMutation.mutateAsync(commentId);
      } catch (error) {
        console.log(error);
        snackbar.send('Error removing comment', 'error');
      }
    },
    [canDelete, deleteCommentMutation, documentUser, snackbar],
  );

  const userProfileMap: Record<string, IUserProfileWithUserId> = {};

  userProfileResults.forEach(res => {
    if (res.data) {
      userProfileMap[res.data.userId] = res.data;
    }
  });

  return (
    <DashboardCard title="Comments" xs={12}>
      {commentsLoading && <CenteredLoadingIndicator />}
      <List sx={{ width: '100%' }}>
        <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ width: '100%' }}>
            <ConditionalTooltip
              title="Sign in to join the discussion"
              visible={!documentUser}
            >
              <TextField
                fullWidth
                placeholder="New comment"
                variant="standard"
                onFocus={handleInputFocus}
                disabled={!documentUser}
                helperText={commentValidation}
                error={!!commentValidation}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                multiline
              />
            </ConditionalTooltip>
          </Box>
          {isCommenting && (
            <Fade in timeout={500}>
              <Box sx={{ width: '100%', mt: isCommenting ? 2 : 0 }}>
                <Button
                  color="primary"
                  onClick={handleCreateComment}
                  disabled={!documentUser}
                >
                  Save
                </Button>
                <Button
                  color="secondary"
                  sx={{ ml: 1 }}
                  onClick={handleNewCommentClose}
                  disabled={!documentUser}
                >
                  Cancel
                </Button>
              </Box>
            </Fade>
          )}
        </ListItem>
        {comments.map(comment => (
          <Fade key={comment.id} in timeout={500}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <IconButton
                  onClick={e =>
                    setCommentMenu({
                      anchor: e.currentTarget,
                      userId: comment.userId,
                      commentId: comment.id,
                    })
                  }
                >
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src={userProfileMap[comment.userId]?.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex">
                    <Typography>
                      {userProfileMap[comment.userId]?.username}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ ml: 1, fontSize: 11, alignSelf: 'center' }}
                    >
                      <ReactTimeago
                        date={getDateFromFirestoreTimestamp(comment.createdAt)}
                      />
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box display="flex" flexDirection="column">
                    <span>{comment.content}</span>
                    <LikeIndicator
                      isLiked={
                        !!documentUser &&
                        comment.likedByUserIds.includes(documentUser.userId)
                      }
                      numLikes={comment.likedByUserIds.length}
                      enabled={!!documentUser}
                      onClick={isAdditive =>
                        handleLikeComment(comment.id, isAdditive)
                      }
                    />
                  </Box>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItem>
          </Fade>
        ))}
      </List>
      <Menu
        anchorEl={commentMenu?.anchor}
        open={!!commentMenu?.anchor}
        onClose={() => setCommentMenu(null)}
      >
        <Link
          href={appRoutes.users.view.path(commentMenu?.userId ?? '')}
          passHref
        >
          <MenuItem>View user</MenuItem>
        </Link>
        {canDelete(commentMenu?.userId) && (
          <MenuItem
            onClick={() =>
              handleDeleteComment(commentMenu?.commentId, commentMenu?.userId)
            }
            sx={{ color: 'error.main' }}
          >
            Remove
          </MenuItem>
        )}
      </Menu>
    </DashboardCard>
  );
}

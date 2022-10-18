import {
  Avatar,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  IUserDocument,
  USER_DOCUMENT_BIO_MAX_LENGTH,
  USER_DOCUMENT_USERNAME_LENGTH,
} from '../../../entities/user';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  useUpdateUserProfileAvatarMutation,
  useUpdateUserProfileItemMutation,
  useUpdateUserUsernameMutation,
} from '../../../lib/queries/users/userMutations';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box } from '@mui/system';
import CenteredLoadingIndicator from '../../shared/CenteredLoadingIndicator';
import ClearIcon from '@mui/icons-material/Clear';
import { RequiredProps } from '../../../lib/types/typeModifiers';
import { USERNAME_ALREADY_EXISTS_ERROR } from '../../../lib/constants/errors';
import { useSnackbarAlert } from '../../shared/SnackbarAlert';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';

const UserProfilePage = () => {
  const { documentUser, documentUserLoading, authUser } = useUserContext();
  const snackbar = useSnackbarAlert();

  const updateUserProfileMutation = useUpdateUserProfileItemMutation();
  const updateUserProfileAvatarMutation = useUpdateUserProfileAvatarMutation();
  const updateUserUsernameMutation = useUpdateUserUsernameMutation();

  const [avatarState, setAvatarState] = useState<{
    value?: string;
    file: File | null;
    upload: number | null;
  }>({ value: '', file: null, upload: null });

  const [usernameState, setUsernameState] = useState<{
    value?: string;
    message?: string;
  }>({});

  const [bioState, setBioState] = useState<{
    value?: string;
    message?: string;
  }>({});

  useEffect(() => {
    if (documentUser) {
      setAvatarState(state => ({
        ...state,
        value: documentUser.profile?.avatar,
      }));
      setUsernameState(state => ({
        ...state,
        value: documentUser.profile?.username,
      }));
      setBioState(state => ({
        ...state,
        value: documentUser.profile?.bio,
      }));
    }
  }, [documentUser]);

  const handleAvatarTextChange = useCallback(
    (value: string) => setAvatarState(state => ({ ...state, value })),
    [],
  );

  const handleAvatarReset = useCallback(() => {
    if (!documentUser) return;

    handleAvatarTextChange(documentUser.profile?.avatar ?? '');
  }, [documentUser, handleAvatarTextChange]);

  const handleUsernameValueChange = useCallback(
    (value: string) => setUsernameState(state => ({ ...state, value })),
    [],
  );

  const handleUsernameReset = useCallback(() => {
    if (!documentUser) return;

    handleUsernameValueChange(documentUser.profile?.username ?? '');
  }, [documentUser, handleUsernameValueChange]);

  const handleBioValueChange = useCallback(
    (value: string) => setBioState(state => ({ ...state, value })),
    [],
  );

  const handleBioReset = useCallback(() => {
    if (!documentUser) return;

    handleBioValueChange(documentUser.profile?.bio ?? '');
  }, [documentUser, handleBioValueChange]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      setAvatarState(state => ({ ...state, file: event.target.files![0] }));
    },
    [],
  );

  const handleFileRemove = useCallback(
    () => setAvatarState(state => ({ ...state, file: null })),
    [],
  );

  const handleUpdateProfileItem = useCallback(
    async (
      key: keyof RequiredProps<IUserDocument>['profile'],
      value: string,
    ) => {
      if (!documentUser) return;

      try {
        await updateUserProfileMutation.mutateAsync({
          key,
          value,
          userId: documentUser.userId,
        });
        snackbar.send('Profile updated', 'success');
      } catch (error) {
        console.log(error);
        snackbar.send('Error updating profile', 'error');
      }
    },
    [documentUser, snackbar, updateUserProfileMutation],
  );

  const handleAvatarSave = useCallback(async () => {
    if (!documentUser) return;

    if (!avatarState.file) {
      if (avatarState.value) {
        await handleUpdateProfileItem('avatar', avatarState.value);
      }
      return;
    }

    try {
      await updateUserProfileAvatarMutation.mutateAsync({
        file: avatarState.file,
        userId: documentUser.userId,
        progressCallback: value =>
          setAvatarState(state => ({ ...state, upload: value })),
      });
      snackbar.send('Profile updated', 'success');
    } catch (error) {
      console.log(error);
    }
    handleFileRemove();
  }, [
    avatarState.file,
    avatarState.value,
    documentUser,
    handleFileRemove,
    handleUpdateProfileItem,
    snackbar,
    updateUserProfileAvatarMutation,
  ]);

  const handleUsernameSave = useCallback(async () => {
    if (!documentUser) return;

    setUsernameState(state => ({ ...state, message: undefined }));
    if (usernameState.value !== documentUser.profile?.username) {
      // check length
      if (
        !usernameState.value ||
        usernameState.value === '' ||
        usernameState.value.length < USER_DOCUMENT_USERNAME_LENGTH.min ||
        usernameState.value.length > USER_DOCUMENT_USERNAME_LENGTH.max
      ) {
        setUsernameState(state => ({
          ...state,
          message: `Username must be ${USER_DOCUMENT_USERNAME_LENGTH.min}-${USER_DOCUMENT_USERNAME_LENGTH.max} characters`,
        }));
        return;
      }
      try {
        await updateUserUsernameMutation.mutateAsync({
          username: usernameState.value,
          userId: documentUser.userId,
        });
        snackbar.send('Username updated', 'success');
      } catch (error: any) {
        if (error && error.code === USERNAME_ALREADY_EXISTS_ERROR.code) {
          return setUsernameState(state => ({
            ...state,
            message: USERNAME_ALREADY_EXISTS_ERROR.message,
          }));
        }
        console.log(error);
        snackbar.send('Error checking username', 'error');
      }
    }
  }, [documentUser, snackbar, updateUserUsernameMutation, usernameState.value]);

  const handleBioSave = useCallback(async () => {
    if (!documentUser) return;

    setBioState(state => ({ ...state, message: undefined }));

    if (
      bioState.value &&
      bioState.value.length > USER_DOCUMENT_BIO_MAX_LENGTH
    ) {
      setBioState(state => ({
        ...state,
        message: `Bio must be less than ${USER_DOCUMENT_BIO_MAX_LENGTH} characters`,
      }));
      return;
    }

    return await handleUpdateProfileItem('bio', bioState.value ?? '');
  }, [bioState.value, documentUser, handleUpdateProfileItem]);
  const handleUseAuthImage = useCallback(() => {
    if (!authUser) return;

    setAvatarState(state => ({
      ...state,
      file: null,
      value: authUser.photoURL ?? '',
    }));
  }, [authUser]);

  if (documentUserLoading) return <CenteredLoadingIndicator />;

  return (
    <Paper sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} container>
          <Grid item xs={12} md={4}>
            <Avatar
              sx={{ width: 200, height: 200 }}
              src={
                avatarState.file
                  ? URL.createObjectURL(avatarState.file)
                  : avatarState.value
              }
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box>
              <TextField
                label="Avatar"
                variant="standard"
                fullWidth
                value={avatarState.value}
                onChange={e => handleAvatarTextChange(e.target.value)}
                disabled={!!avatarState.file}
                InputProps={{
                  endAdornment: (
                    <Fragment>
                      {documentUser?.profile?.avatar !== avatarState.value && (
                        <Tooltip title="Reset">
                          <IconButton onClick={handleAvatarReset}>
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Button
                        disabled={
                          !!avatarState.file ||
                          avatarState.value === documentUser?.profile?.avatar ||
                          updateUserProfileMutation.isLoading ||
                          updateUserProfileAvatarMutation.isLoading
                        }
                        onClick={handleAvatarSave}
                      >
                        Save
                      </Button>
                    </Fragment>
                  ),
                }}
              />
            </Box>
            {avatarState.file && avatarState.upload !== null && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="overline">Uploading image...</Typography>
                <LinearProgress
                  variant="determinate"
                  value={avatarState.upload}
                />
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              {!avatarState.file && (
                <Button
                  variant="contained"
                  disableElevation
                  component="label"
                  color="secondary"
                >
                  Upload
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                  />
                </Button>
              )}
              {avatarState.file && (
                <Fragment>
                  <Button
                    variant="contained"
                    disableElevation
                    onClick={handleAvatarSave}
                    color="secondary"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleFileRemove}
                    sx={{ ml: 2 }}
                  >
                    Cancel
                  </Button>
                </Fragment>
              )}
            </Box>
            {!!authUser?.photoURL && (
              <Box sx={{ mt: 2 }}>
                <Button
                  startIcon={<AddPhotoAlternateIcon />}
                  onClick={handleUseAuthImage}
                  color="secondary"
                >
                  Use my auth image
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="standard"
            fullWidth
            label="Username"
            value={usernameState.value}
            onChange={e => handleUsernameValueChange(e.target.value)}
            error={!!usernameState.message}
            helperText={usernameState.message}
            InputProps={{
              endAdornment: (
                <Fragment>
                  {documentUser?.profile?.username !== usernameState.value && (
                    <Tooltip title="Reset">
                      <IconButton onClick={handleUsernameReset}>
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Button
                    disabled={
                      updateUserUsernameMutation.isLoading ||
                      usernameState.value === documentUser?.profile?.username
                    }
                    onClick={handleUsernameSave}
                  >
                    Save
                  </Button>
                </Fragment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="standard"
            multiline
            fullWidth
            label="Bio"
            rows="5"
            value={bioState.value}
            onChange={e => handleBioValueChange(e.target.value)}
            error={!!bioState.message}
            helperText={bioState.message}
            InputProps={{
              endAdornment: (
                <Fragment>
                  {documentUser?.profile?.bio !== bioState.value && (
                    <Tooltip title="Reset">
                      <IconButton onClick={handleBioReset}>
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Button
                    onClick={handleBioSave}
                    disabled={
                      updateUserProfileMutation.isLoading ||
                      documentUser?.profile?.bio === bioState.value
                    }
                  >
                    Save
                  </Button>
                </Fragment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserProfilePage;

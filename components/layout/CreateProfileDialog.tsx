import * as yup from 'yup';

import {
  Avatar,
  Box,
  Button,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  IUserDocument,
  USER_DOCUMENT_BIO_MAX_LENGTH,
  USER_DOCUMENT_USERNAME_LENGTH,
} from '../../entities/user';
import React, { useCallback, useEffect, useState } from 'react';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { FormikTextField } from '../form/wrappers';
import { FullscreenDialog } from '../shared/FullscreenDialog';
import { LoadingButton } from '@mui/lab';
import { RequiredProps } from '../../lib/types/typeModifiers';
import { USERNAME_ALREADY_EXISTS_ERROR } from '../../lib/constants/errors';
import { firebaseAuth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCreateUserProfileMutation } from '../../lib/queries/users/userMutations';
import { useFormik } from 'formik';
import { useGetUserQuery } from '../../lib/queries/users/userQueries';
import { useSnackbarAlert } from '../shared/SnackbarAlert';

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(
      USER_DOCUMENT_USERNAME_LENGTH.min,
      `Username must be at least ${USER_DOCUMENT_USERNAME_LENGTH.min} characters`,
    )
    .max(
      USER_DOCUMENT_USERNAME_LENGTH.max,
      `Username must be at most ${USER_DOCUMENT_USERNAME_LENGTH.max} characters`,
    ),
  bio: yup
    .string()
    .max(
      USER_DOCUMENT_BIO_MAX_LENGTH,
      `Bio must be less than ${USER_DOCUMENT_BIO_MAX_LENGTH} characters`,
    ),
});

const CreateProfileDialog = () => {
  const [user, userLoading] = useAuthState(firebaseAuth);
  const snackbar = useSnackbarAlert();

  const { data: documentUser, isLoading: documentUserLoading } =
    useGetUserQuery(user?.uid);

  const createProfileMutation = useCreateUserProfileMutation();

  const [open, setOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [uploadPercent, setUploadPercent] = useState<number | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const handleFormSubmit = useCallback(
    async (values: RequiredProps<IUserDocument>['profile']) => {
      if (!user) return;

      try {
        setErrorMessage(undefined);
        await createProfileMutation.mutateAsync({
          profile: values,
          userId: user.uid,
          file: avatarFile,
          progressCallback: value => setUploadPercent(value),
        });
        snackbar.send('Profile saved', 'success');
      } catch (error: any) {
        if (error && error.code === USERNAME_ALREADY_EXISTS_ERROR.code) {
          setErrorMessage(error.message);
          return;
        }
        console.log(error);
        snackbar.send('Error saving profile', 'error');
      }
      setUploadPercent(undefined);
    },
    [avatarFile, createProfileMutation, snackbar, user],
  );

  const formik = useFormik<RequiredProps<IUserDocument>['profile']>({
    initialValues: {
      username: '',
      avatar: '',
      bio: '',
    },
    onSubmit: values => handleFormSubmit(values),
    validationSchema,
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      setAvatarFile(event.target.files[0]);
    },
    [setAvatarFile],
  );

  const handleFileRemove = useCallback(
    () => setAvatarFile(undefined),
    [setAvatarFile],
  );

  useEffect(() => {
    formik.setFieldError('username', errorMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  const handleUseAuthImage = useCallback(() => {
    if (!user) return;

    setAvatarFile(undefined);
    formik.setFieldValue('avatar', user.photoURL);
  }, [formik, user]);

  const hide =
    userLoading ||
    documentUserLoading ||
    (user && documentUser && documentUser.profile);

  useEffect(() => {
    setOpen(!hide);
  }, [hide]);

  if (hide) return null;

  return (
    <FullscreenDialog
      title="Real quick..."
      open={open}
      onClose={() => setOpen(false)}
      transition="default"
      responsive
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">Set up your profile</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Avatar
              sx={{ width: 200, height: 200 }}
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : formik.values.avatar
              }
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box>
              <FormikTextField
                name="avatar"
                label="Avatar"
                formik={formik}
                inputProps={{
                  variant: 'standard',
                  fullWidth: true,
                  disabled: !!avatarFile,
                }}
              />
            </Box>
            {avatarFile && uploadPercent !== null && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="overline">Uploading image...</Typography>
                <LinearProgress variant="determinate" value={uploadPercent} />
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              {!avatarFile && (
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
              {avatarFile && (
                <Button
                  variant="outlined"
                  onClick={handleFileRemove}
                  sx={{ ml: 2 }}
                  color="secondary"
                >
                  Clear
                </Button>
              )}
            </Box>
            {!!user?.photoURL && (
              <Box sx={{ mt: 2 }}>
                <Button
                  startIcon={<AddPhotoAlternateIcon />}
                  onClick={handleUseAuthImage}
                >
                  Use my auth image
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <FormikTextField
              name="username"
              label="Username"
              formik={formik}
              inputProps={{
                variant: 'standard',
                fullWidth: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormikTextField
              name="bio"
              label="Bio"
              formik={formik}
              inputProps={{
                variant: 'standard',
                fullWidth: true,
                multiline: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              type="submit"
              loading={createProfileMutation.isLoading}
              variant="contained"
            >
              Save
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </FullscreenDialog>
  );
};

export default CreateProfileDialog;

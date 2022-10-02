/* eslint-disable @next/next/no-img-element */

import * as yup from 'yup';

import { Button, Grid, LinearProgress, Typography } from '@mui/material';
import {
  FormikCheckbox,
  FormikTextField,
} from '../../../lib/components/form/wrappers';
import {
  ICollection,
  createCollection,
  createCollectionWithRef,
  createNewColletionRef,
} from '../../../entities/collection';
import React, { useCallback, useState } from 'react';
import withUser, { useUserContext } from '../../../lib/hoc/withUser';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { LoadingButton } from '@mui/lab';
import { saveFirebaseCollectionImage } from '../../../entities/firebaseFiles';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbarAlert } from '../../../lib/components/shared/SnackbarAlert';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});

const NewCollection = () => {
  const router = useRouter();
  const { documentUser } = useUserContext();
  const snackbarContext = useSnackbarAlert();

  const [createLoading, setCreateLoading] = useState(false);
  const [fileUploadPercent, setFileUploadPercent] = useState<number | null>(
    null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onSubmit = useCallback(
    async (values: ICollection) => {
      if (!documentUser) return;

      setCreateLoading(true);
      try {
        let createdId: string;
        if (imageFile) {
          const newCollectionRef = createNewColletionRef();
          const savedFileUrl = await saveFirebaseCollectionImage({
            file: imageFile,
            userId: documentUser.userId,
            collectionId: newCollectionRef.id,
            progressCallback: value => setFileUploadPercent(value),
          });

          await createCollectionWithRef(
            { ...values, coverImageUrl: savedFileUrl },
            documentUser.userId,
            newCollectionRef,
          );
          createdId = newCollectionRef.id;
        } else {
          createdId = await createCollection(values, documentUser.userId);
        }
        snackbarContext.send('Collection created', 'success');
        router.push(`/stash/collections/${createdId}?tab=3`);
      } catch (error) {
        console.log(error);
        snackbarContext.send('Error creating collection', 'error');
      }
      setFileUploadPercent(null);
      setCreateLoading(false);
    },
    [documentUser, router, snackbarContext, imageFile],
  );

  const formik = useFormik<ICollection>({
    initialValues: {
      name: '',
      userId: documentUser?.userId ?? '',
      description: '',
      isPublic: false,
      coverImageUrl: '',
      itemIds: [],
      favoriteItemIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    onSubmit: values => onSubmit(values),
    validationSchema,
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      setImageFile(event.target.files[0]);
    },
    [],
  );

  const handleFileRemove = useCallback(() => setImageFile(null), []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Link href="/stash/collections" passHref>
          <Button startIcon={<ArrowBackIcon />}>Back to collections</Button>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2" component="h1">
          New collection
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormikTextField
                name="name"
                label="Name"
                formik={formik}
                inputProps={{ variant: 'standard', fullWidth: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormikTextField
                name="description"
                label="Description"
                formik={formik}
                inputProps={{
                  variant: 'standard',
                  fullWidth: true,
                  multiline: true,
                }}
              />
            </Grid>
            <Grid item xs={10}>
              <FormikTextField
                name="coverImageUrl"
                label="Cover Image URL"
                formik={formik}
                inputProps={{
                  variant: 'standard',
                  fullWidth: true,
                  disabled: !!imageFile,
                }}
              />
            </Grid>
            <Grid item xs={2} display="flex">
              {!imageFile ? (
                <Button variant="outlined" component="label">
                  Upload file
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                  />
                </Button>
              ) : (
                <Button variant="outlined" onClick={handleFileRemove}>
                  Remove file
                </Button>
              )}
            </Grid>
            {formik.values.coverImageUrl && !imageFile && (
              <Grid item xs={12}>
                <Typography variant="caption">Preview</Typography>
                <img
                  src={formik.values.coverImageUrl}
                  style={{
                    height: '200px',
                    width: '100%',
                    objectFit: 'contain',
                  }}
                  alt="Image preview"
                />
              </Grid>
            )}
            {!!imageFile && (
              <Grid item xs={12}>
                <Typography variant="caption">Image upload</Typography>
                <img
                  src={URL.createObjectURL(imageFile)}
                  style={{
                    height: '200px',
                    width: '100%',
                    objectFit: 'contain',
                  }}
                  alt="Image upload"
                />
              </Grid>
            )}
            {!!imageFile && fileUploadPercent !== null && (
              <Grid item xs={12}>
                <Typography variant="overline">Uploading image...</Typography>
                <LinearProgress
                  value={fileUploadPercent}
                  variant="determinate"
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormikCheckbox
                name="isPublic"
                label="Public"
                formik={formik}
                inputProps={{}}
              />
            </Grid>
            <Grid item>
              <LoadingButton
                type="submit"
                loading={createLoading}
                variant="contained"
                disableElevation
              >
                Save
              </LoadingButton>
            </Grid>
            <Grid item>
              <Link href="/stash/collections" passHref>
                <Button
                  disabled={createLoading}
                  variant="outlined"
                  color="error"
                  sx={{ ml: 2 }}
                >
                  Cancel
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default withUser(NewCollection);

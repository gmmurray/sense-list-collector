/* eslint-disable @next/next/no-img-element */

import * as yup from 'yup';

import {
  Button,
  Divider,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  COLLECTION_DESCRIPTION_MAX_LENGTH,
  ICollectionWithId,
} from '../../../../entities/collection';
import { FormikCheckbox, FormikTextField } from '../../../form/wrappers';
import React, { useCallback, useMemo, useState } from 'react';
import {
  useDeleteCollectionMutation,
  useUpdateCollection,
  useUpdateCollectionItemsMutation,
  useUpdateCollectionWithImageMutation,
} from '../../../../lib/queries/collections/collectionMutations';

import { LoadingButton } from '@mui/lab';
import ManageCollectionItemsList from './ManageCollectionItemsList';
import { useCollectionTabContext } from '../CollectionTabContext';
import { useFormik } from 'formik';
import { useGetLatestUserItemsQuery } from '../../../../lib/queries/items/itemQueries';
import { useRouter } from 'next/router';
import { useSnackbarAlert } from '../../../shared/SnackbarAlert';
import { useUserContext } from '../../../../lib/hoc/withUser/userContext';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup
    .string()
    .required('Description is required')
    .max(
      COLLECTION_DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${COLLECTION_DESCRIPTION_MAX_LENGTH} characters`,
    ),
});

const CollectionSettingsTab = () => {
  const router = useRouter();
  const { authUser } = useUserContext();
  const {
    collection,
    items: collectionItems,
    itemsLoading: collectionItemsLoading,
  } = useCollectionTabContext();
  const snackbarContext = useSnackbarAlert();

  const { data: userItems = [], isLoading: userItemsLoading } =
    useGetLatestUserItemsQuery(authUser?.uid);

  const updateCollectionMutation = useUpdateCollection();
  const updateCollectionWithImageMutation =
    useUpdateCollectionWithImageMutation();
  const updateCollectionItemsMutation = useUpdateCollectionItemsMutation();
  const deleteCollectionMutation = useDeleteCollectionMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploadPercent, setImageUploadPercent] = useState<number | null>(
    null,
  );

  const onSubmit = useCallback(
    async (values: ICollectionWithId) => {
      if (!authUser) return;

      try {
        if (imageFile) {
          await updateCollectionWithImageMutation.mutateAsync({
            collection: values,
            file: imageFile,
            progressCallback: value => setImageUploadPercent(value),
          });
        } else {
          await updateCollectionMutation.mutateAsync({ collection: values });
        }
        snackbarContext.send('Collection updated', 'success');
      } catch (error) {
        console.log(error);
        snackbarContext.send('Error updating collection', 'error');
      }
      setImageUploadPercent(null);
    },
    [
      authUser,
      imageFile,
      snackbarContext,
      updateCollectionMutation,
      updateCollectionWithImageMutation,
    ],
  );

  const formik = useFormik<ICollectionWithId>({
    initialValues: collection!,
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

  const handleFormReset = useCallback(() => {
    handleFileRemove();
    formik.resetForm();
  }, [formik, handleFileRemove]);

  const userItemsNotInCollection = useMemo(
    () => userItems.filter(ui => !collectionItems.some(ci => ci.id === ui.id)),
    [collectionItems, userItems],
  );

  const handleUpdateItems = useCallback(
    async (itemIds: string[], isAdditive: boolean) => {
      try {
        await updateCollectionItemsMutation.mutateAsync({
          itemIds,
          collectionId: collection?.id,
          isAdditive,
        });
        snackbarContext.send('Collection items updated', 'success');
      } catch (error) {
        console.log(error);
        const message = 'Error updating collection items';
        snackbarContext.send(message, 'error');
        throw new Error(message);
      }
    },
    [collection?.id, snackbarContext, updateCollectionItemsMutation],
  );

  const handleDeleteCollection = useCallback(async () => {
    const confirmed = confirm(
      'Are you sure you want to delete this collection? Items will remain but any collection images you have added will be deleted.',
    );
    if (!confirmed) return;

    try {
      await deleteCollectionMutation.mutateAsync({
        userId: authUser?.uid,
        collectionId: collection?.id,
      });
      snackbarContext.send('Collection deleted', 'success');
      router.push('/stash/collections');
    } catch (error) {
      console.log(error);
      snackbarContext.send('Error deleting collection', 'error');
    }
  }, [
    authUser?.uid,
    collection?.id,
    deleteCollectionMutation,
    router,
    snackbarContext,
  ]);

  if (!collection) return null;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Details</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container>
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
                <Grid item xs={12} md={10}>
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
                <Grid item xs={12} md={2} display="flex">
                  {!imageFile ? (
                    <Button
                      variant="outlined"
                      component="label"
                      color="secondary"
                    >
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
                {formik.values.coverImageUrl &&
                  !imageFile &&
                  formik.values.coverImageUrl !==
                    formik.initialValues.coverImageUrl && (
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
                {!!imageFile && imageUploadPercent !== null && (
                  <Grid item xs={12}>
                    <Typography variant="overline">
                      Uploading image...
                    </Typography>
                    <LinearProgress
                      value={imageUploadPercent}
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
                    loading={
                      updateCollectionMutation.isLoading ||
                      updateCollectionWithImageMutation.isLoading
                    }
                    variant="contained"
                    disableElevation
                  >
                    Save
                  </LoadingButton>
                </Grid>
                <Grid item>
                  <Button
                    disabled={
                      updateCollectionMutation.isLoading ||
                      updateCollectionWithImageMutation.isLoading ||
                      updateCollectionItemsMutation.isLoading ||
                      deleteCollectionMutation.isLoading
                    }
                    variant="outlined"
                    color="warning"
                    sx={{ ml: 1 }}
                    onClick={handleFormReset}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">Items</Typography>
        <Divider sx={{ mb: 2 }} />
        <ManageCollectionItemsList
          collection={collection}
          collectionItems={collectionItems}
          userItems={userItemsNotInCollection}
          itemsLoading={collectionItemsLoading || userItemsLoading}
          saveLoading={updateCollectionItemsMutation.isLoading}
          onSave={handleUpdateItems}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">Danger zone</Typography>
        <Divider sx={{ mb: 2 }} />
        <LoadingButton
          variant="contained"
          color="warning"
          onClick={handleDeleteCollection}
          loading={deleteCollectionMutation.isLoading}
        >
          Delete collection
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default CollectionSettingsTab;

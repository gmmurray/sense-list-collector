/* eslint-disable @next/next/no-img-element */

import * as yup from 'yup';

import { Button, Divider, Grid, Typography } from '@mui/material';
import { FormikContextType, useFormik } from 'formik';
import {
  IItem,
  IItemWithId,
  ITEM_DESCRIPTION_MAX_LENGTH,
} from '../../../entities/item';
import React, { useCallback, useState } from 'react';
import {
  useDeleteItemMutation,
  useUpdateItemMutation,
  useUpdateItemWithImageMutation,
} from '../../../lib/queries/items/itemMutations';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenteredLoadingIndicator from '../../../lib/components/shared/CenteredLoadingIndicator';
import CenteredMessage from '../../../lib/components/shared/CenteredMessage';
import CreateEditItemForm from '../../../lib/components/items/CreateEditItemForm';
import Link from 'next/link';
import { LoadingButton } from '@mui/lab';
import { getItemPrimaryImageUrl } from '../../../lib/constants/images';
import { getStringFromStringOrArray } from '../../../lib/helpers/stringHelpers';
import { useGetUserItemQuery } from '../../../lib/queries/items/itemQueries';
import { useRouter } from 'next/router';
import { useSnackbarAlert } from '../../../lib/components/shared/SnackbarAlert';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';
import withUser from '../../../lib/hoc/withUser';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup
    .string()
    .max(
      ITEM_DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${ITEM_DESCRIPTION_MAX_LENGTH} characters`,
    ),
});

const ViewItem = () => {
  const router = useRouter();

  const {
    query: { itemId },
  } = router;

  const { documentUser } = useUserContext();
  const snackbarContext = useSnackbarAlert();

  const updateItemMutation = useUpdateItemMutation();
  const updateItemWithImageMutation = useUpdateItemWithImageMutation();
  const deleteItemMutation = useDeleteItemMutation();

  const { data: item, isLoading: itemLoading } = useGetUserItemQuery(
    getStringFromStringOrArray(itemId),
    documentUser?.userId,
  );

  const [fileUploadPercent, setFileUploadPercent] = useState<number | null>(
    null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onSubmit = useCallback(
    async (values: IItemWithId | {}) => {
      if (!documentUser || Object.keys(values).length === 0) return;

      try {
        if (imageFile) {
          await updateItemWithImageMutation.mutateAsync({
            item: values as IItemWithId,
            file: imageFile,
            progressCallback: value => setFileUploadPercent(value),
          });
        } else {
          await updateItemMutation.mutateAsync({
            item: values as IItemWithId,
          });
        }

        snackbarContext.send('Item updated', 'success');
      } catch (error) {
        console.log(error);
        snackbarContext.send('Error updating item', 'error');
      }
      setFileUploadPercent(null);
    },
    [
      documentUser,
      imageFile,
      snackbarContext,
      updateItemMutation,
      updateItemWithImageMutation,
    ],
  );

  const formik = useFormik<IItem>({
    initialValues: item ?? {
      name: '',
      userId: '',
      category: '',
      images: [],
      collectionIds: [],
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    onSubmit: values => onSubmit({ ...values, id: item?.id ?? '' }),
    validationSchema,
    enableReinitialize: true,
  });

  const handleDeleteItem = useCallback(async () => {
    const confirmed = confirm(
      'Are you sure you want to delete this item? Any item images you have added will be deleted.',
    );
    if (!confirmed) return;

    try {
      await deleteItemMutation.mutateAsync({
        userId: documentUser?.userId,
        itemId: item?.id,
      });
      snackbarContext.send('Item deleted', 'success');
      router.push('/stash/items');
    } catch (error) {
      console.log(error);
      snackbarContext.send('Error deleting item', 'error');
    }
  }, [
    deleteItemMutation,
    documentUser?.userId,
    item?.id,
    router,
    snackbarContext,
  ]);

  const renderContent = () => {
    if (itemLoading) {
      return <CenteredLoadingIndicator />;
    } else if (!item) {
      return <CenteredMessage message="Item could not be found" />;
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">{item.name}</Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <img
            src={getItemPrimaryImageUrl(item)}
            style={{
              objectFit: 'contain',
              height: '300px',
              width: '100%',
            }}
            alt={item.name}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Details</Typography>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <CreateEditItemForm
            formik={formik}
            fileUploadPercent={fileUploadPercent}
            imageFile={imageFile}
            onImageFileChange={value => setImageFile(value)}
            isLoading={
              updateItemMutation.isLoading ||
              updateItemWithImageMutation.isLoading ||
              deleteItemMutation.isLoading
            }
            isEdit
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Danger zone</Typography>
          <Divider sx={{ mb: 2 }} />
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleDeleteItem}
            loading={deleteItemMutation.isLoading}
          >
            Delete item
          </LoadingButton>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Link href="/stash/items" passHref>
          <Button startIcon={<ArrowBackIcon />}>Back to items</Button>
        </Link>
      </Grid>
      <Grid item xs={12}>
        {renderContent()}
      </Grid>
    </Grid>
  );
};

export default withUser(ViewItem);

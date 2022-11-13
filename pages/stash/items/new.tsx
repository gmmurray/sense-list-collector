/* eslint-disable @next/next/no-img-element */

import * as yup from 'yup';

import { Button, Grid, Typography } from '@mui/material';
import { IItem, ITEM_DESCRIPTION_MAX_LENGTH } from '../../../entities/item';
import React, { useCallback, useState } from 'react';
import {
  getStringFromStringOrArray,
  stringHasValue,
} from '../../../lib/helpers/stringHelpers';
import {
  useCreateItemMutation,
  useCreateItemWithImageMutation,
} from '../../../lib/queries/items/itemMutations';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateEditItemForm from '../../../components/items/CreateEditItemForm';
import Link from 'next/link';
import { appRoutes } from '../../../lib/constants/routes';
import { useFormik } from 'formik';
import usePageTitle from '../../../lib/hooks/usePageTitle';
import { useRouter } from 'next/router';
import { useSnackbarAlert } from '../../../components/shared/SnackbarAlert';
import { useUserContext } from '../../../lib/hoc/withUser/userContext';
import withLayout from '../../../lib/hoc/layout/withLayout';
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

const NewItem = () => {
  usePageTitle(appRoutes.stash.items.new.title);
  const router = useRouter();
  const { documentUser } = useUserContext();
  const snackbarContext = useSnackbarAlert();

  const createItemMutation = useCreateItemMutation();
  const createItemWithImageMutation = useCreateItemWithImageMutation();

  const [fileUploadPercent, setFileUploadPercent] = useState<number | null>(
    null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fromCollectionId = getStringFromStringOrArray(
    router.query.collectionId,
  );

  const onSubmit = useCallback(
    async (values: IItem) => {
      if (!documentUser) return;

      try {
        let createdId = imageFile
          ? await createItemWithImageMutation.mutateAsync({
              userId: documentUser.userId,
              item: values,
              file: imageFile,
              progressCallback: value => setFileUploadPercent(value),
            })
          : await createItemMutation.mutateAsync({
              userId: documentUser.userId,
              item: values,
            });

        snackbarContext.send('Item created', 'success');
        const newRoute = stringHasValue(fromCollectionId)
          ? appRoutes.stash.collections.view.path(fromCollectionId)
          : appRoutes.stash.items.view.path(createdId);
        router.push(newRoute);
      } catch (error) {
        console.log(error);
        snackbarContext.send('Error creating item', 'error');
      }
      setFileUploadPercent(null);
    },
    [
      createItemMutation,
      createItemWithImageMutation,
      documentUser,
      fromCollectionId,
      imageFile,
      router,
      snackbarContext,
    ],
  );

  const formik = useFormik<IItem>({
    initialValues: {
      userId: documentUser?.userId ?? '',
      name: '',
      primaryImageUrl: undefined,
      price: undefined,
      description: undefined,
      category: undefined,
      images: [],
      rating: undefined,
      collectionIds: stringHasValue(fromCollectionId) ? [fromCollectionId] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    onSubmit: values => onSubmit(values),
    validationSchema,
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Link href={appRoutes.stash.items.path()} passHref>
          <Button startIcon={<ArrowBackIcon />} color="secondary">
            Back to items
          </Button>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2">New item</Typography>
      </Grid>
      <Grid item xs={12}>
        <CreateEditItemForm
          formik={formik}
          fileUploadPercent={fileUploadPercent}
          imageFile={imageFile}
          onImageFileChange={value => setImageFile(value)}
          isLoading={
            createItemMutation.isLoading ||
            createItemWithImageMutation.isLoading
          }
        />
      </Grid>
    </Grid>
  );
};

export default withLayout(withUser(NewItem));

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import * as yup from 'yup';

import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  Grid,
  InputAdornment,
  Link,
  Typography,
  useTheme,
} from '@mui/material';
import CreatableAutocomplete, {
  CreatableAutocompleteOption,
} from '../form/CreatableAutocomplete';
import { FormikSelect, FormikTextField } from '../form/wrappers';
import {
  IWishListItem,
  WishListItemPriorities,
  WishListItemStatuses,
} from '../../entities/wishList';
import React, { useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/system';
import { ITEM_DESCRIPTION_MAX_LENGTH } from '../../entities/item';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import { useUpdateUserCategoryMutation } from '../../lib/queries/users/userMutations';
import { useUserContext } from '../../lib/hoc/withUser/userContext';
import { useWishListItemsContext } from './WishListItemsContext';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  link: yup.string().url('Must be a valid link').required('Link is required'),
  image: yup.string().url('Must be a valid link'),
  priority: yup.string().oneOf(['low', 'medium', 'high']),
  price: yup.number().typeError('Must be a valid number'),
  description: yup
    .string()
    .max(
      ITEM_DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${ITEM_DESCRIPTION_MAX_LENGTH} characters`,
    ),
});

const WishListItemForm = () => {
  const theme = useTheme();
  const { documentUser } = useUserContext();
  const [categoryOptions, setCategoryOptions] = useState<
    CreatableAutocompleteOption[]
  >([]);
  const {
    editorInitialValue,
    editorLoading,
    onSave,
    onCreate,
    onEditorToggle,
    onConversionItemChange,
  } = useWishListItemsContext();

  const updateUserCategoryMutation = useUpdateUserCategoryMutation();

  useEffect(() => {
    let result: CreatableAutocompleteOption[] = [];

    if (documentUser) {
      result = documentUser.categories?.map(c => ({ value: c })) ?? [];
    }

    setCategoryOptions(result);
  }, [documentUser]);

  const onSubmit = useCallback(
    async (values: IWishListItem) => {
      if (editorInitialValue) {
        return await onSave!(values);
      }

      return await onCreate!(values);
    },
    [editorInitialValue, onCreate, onSave],
  );

  const formik = useFormik<IWishListItem>({
    initialValues: editorInitialValue ?? {
      id: '',
      name: '',
      link: '',
      image: '',
      priority: undefined,
      price: undefined,
      description: undefined,
      category: undefined,
      status: 'need',
    },
    onSubmit: values => onSubmit(values),
    validationSchema,
  });

  const handleCategoryChange = useCallback(
    (value: CreatableAutocompleteOption | null) => {
      formik.setFieldValue('category', value?.value ?? '');
    },
    [formik],
  );

  const handleCategoryCreate = useCallback(
    async (option: CreatableAutocompleteOption) => {
      if (!documentUser) return;

      await updateUserCategoryMutation.mutateAsync({
        category: option.value,
        isAdditive: true,
        userId: documentUser.userId,
      });
    },
    [documentUser, updateUserCategoryMutation],
  );

  const handleAddItem = useCallback(() => {
    if (!editorInitialValue || !onConversionItemChange) return;

    onConversionItemChange({
      item: editorInitialValue,
      includeDeletion: false,
    });
  }, [editorInitialValue, onConversionItemChange]);

  return (
    <Box>
      <Typography variant="h2" component="h1" gutterBottom>
        {editorInitialValue ? 'Update' : 'Create'} wish list item
      </Typography>
      <Collapse in={editorInitialValue && editorInitialValue.status === 'own'}>
        <Alert
          variant={theme.palette.mode === 'dark' ? 'outlined' : 'filled'}
          severity="success"
          sx={{ mb: 2 }}
        >
          <AlertTitle>Done!</AlertTitle>
          This item is marked as owned. You can add it to your stash{' '}
          <Link underline="hover" component="button" onClick={handleAddItem}>
            here
          </Link>
        </Alert>
      </Collapse>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormikTextField
              name="name"
              label="Name"
              formik={formik}
              inputProps={{
                variant: 'standard',
                fullWidth: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormikTextField
              name="link"
              label="Link"
              formik={formik}
              inputProps={{
                variant: 'standard',
                fullWidth: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormikSelect
              formik={formik}
              name="priority"
              label="Priority"
              options={WishListItemPriorities.map(p => ({ name: p, value: p }))}
              inputProps={{
                fullWidth: true,
                variant: 'standard',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormikTextField
              name="price"
              label="Price"
              formik={formik}
              inputProps={{
                fullWidth: true,
                variant: 'standard',
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormikTextField
              name="description"
              label="Description"
              formik={formik}
              inputProps={{
                fullWidth: true,
                variant: 'standard',
                multiline: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CreatableAutocomplete
              id="category"
              name="category"
              label="Category"
              value={formik.values.category}
              onChange={handleCategoryChange}
              onCreate={handleCategoryCreate}
              options={categoryOptions}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormikSelect
              formik={formik}
              name="status"
              label="Status"
              options={WishListItemStatuses.map(p => ({ name: p, value: p }))}
              inputProps={{
                fullWidth: true,
                variant: 'standard',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormikTextField
              name="image"
              label="Image URL"
              formik={formik}
              inputProps={{
                variant: 'standard',
                fullWidth: true,
              }}
            />
          </Grid>
          {formik.values.image && (
            <Grid item xs={12} md={6}>
              <Typography variant="caption">Image preview</Typography>
              <img
                src={formik.values.image}
                style={{
                  height: '200px',
                  width: '100%',
                  objectFit: 'contain',
                }}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <LoadingButton
              type="submit"
              loading={editorLoading}
              variant="contained"
              disableElevation
            >
              Save
            </LoadingButton>
            <Button
              disabled={editorLoading}
              variant="outlined"
              onClick={() => onEditorToggle!(false)}
              color="error"
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default WishListItemForm;

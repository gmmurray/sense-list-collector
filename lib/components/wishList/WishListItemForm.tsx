/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import * as yup from 'yup';

import { Button, Grid, InputAdornment, Typography } from '@mui/material';
import CreatableAutocomplete, {
  CreatableAutocompleteOption,
} from '../form/CreatableAutocomplete';
import { FormikSelect, FormikTextField } from '../form/wrappers';
import {
  IWishListItem,
  WishListItemPriorities,
} from '../../../entities/wishList';
import React, { useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/system';
import { IUserDocument } from '../../../entities/user';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import { useUserContext } from '../../hoc/withUser';
import { useWishListItemsContext } from './WishListItemsContext';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  link: yup.string().url('Must be a valid link').required('Link is required'),
  image: yup.string().url('Must be a valid link'),
  priority: yup.string().oneOf(['low', 'medium', 'high']),
  price: yup.number().typeError('Must be a valid number'),
  description: yup.string(),
});

const WishListItemForm = () => {
  const { documentUser, onUpdateDocumentUser } = useUserContext();
  const [categoryOptions, setCategoryOptions] = useState<
    CreatableAutocompleteOption[]
  >([]);
  const {
    editorInitialValue,
    editorLoading,
    onSave,
    onCreate,
    onEditorToggle,
  } = useWishListItemsContext();

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
        return await onSave!(editorInitialValue.id, values);
      }

      return await onCreate!(values);
    },
    [editorInitialValue, onCreate, onSave],
  );

  const formik = useFormik<IWishListItem>({
    initialValues: editorInitialValue ?? {
      id: '',
      name: '',
      link: 'https://google.com', //TODO: remove
      image: 'https://placehold.jp/100x100.png', //TODO: remove
      priority: undefined,
      price: undefined,
      description: undefined,
      category: undefined,
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
      if (!documentUser || !onUpdateDocumentUser) return;

      const newValue: IUserDocument = {
        ...documentUser,
        categories: [...(documentUser.categories ?? []), option.value],
      };

      await onUpdateDocumentUser(newValue);
    },
    [documentUser, onUpdateDocumentUser],
  );

  return (
    <Box>
      <Typography variant="h2" component="h1" gutterBottom>
        {editorInitialValue ? 'Update' : 'Create'} wish list item
      </Typography>
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
          <Grid item>
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

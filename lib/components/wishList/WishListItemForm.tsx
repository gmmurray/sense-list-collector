/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import * as yup from 'yup';

import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CreatableAutocomplete, {
  CreatableAutocompleteOption,
} from '../form/CreatableAutocomplete';
import React, { useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/system';
import { IUserDocument } from '../../../entities/user';
import { IWishListItem } from '../../../entities/wishList';
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
  const [options, setOptions] = useState<CreatableAutocompleteOption[]>([]);
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

    setOptions(result);
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
            <TextField
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && !!formik.errors.name}
              helperText={formik.touched.name && formik.errors.name}
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="link"
              name="link"
              label="Link"
              value={formik.values.link}
              onChange={formik.handleChange}
              error={formik.touched.link && !!formik.errors.link}
              helperText={formik.touched.link && formik.errors.link}
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              variant="standard"
              error={formik.touched.priority && !!formik.errors.priority}
            >
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                id="priority"
                name="priority"
                label="Priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
              >
                <MenuItem value={undefined}>select</MenuItem>
                <MenuItem value="low">low</MenuItem>
                <MenuItem value="medium">medium</MenuItem>
                <MenuItem value="high">high</MenuItem>
              </Select>
              {formik.touched.priority && !!formik.errors.priority && (
                <FormHelperText>{formik.errors.priority}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="price"
              name="price"
              label="Price"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && !!formik.errors.price}
              helperText={formik.touched.price && formik.errors.price}
              variant="standard"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="description"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && !!formik.errors.description}
              helperText={
                formik.touched.description && formik.errors.description
              }
              variant="standard"
              fullWidth
              multiline
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
              options={options}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="image"
              name="image"
              label="Image URL"
              value={formik.values.image}
              onChange={formik.handleChange}
              error={formik.touched.image && !!formik.errors.image}
              helperText={formik.touched.image && formik.errors.image}
              variant="standard"
              fullWidth
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

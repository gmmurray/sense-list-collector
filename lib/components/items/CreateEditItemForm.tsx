/* eslint-disable @next/next/no-img-element */

import { Button, Grid, LinearProgress, Typography } from '@mui/material';
import CreatableAutocomplete, {
  CreatableAutocompleteOption,
} from '../form/CreatableAutocomplete';
import { FormikSelect, FormikTextField } from '../form/wrappers';
import { IItem, itemRatingOptions } from '../../../entities/item';
import React, { useCallback, useEffect, useState } from 'react';

import { FormikContextType } from 'formik';
import Link from 'next/link';
import { LoadingButton } from '@mui/lab';
import { useUpdateUserCategoryMutation } from '../../queries/users/userMutations';
import { useUserContext } from '../../hoc/withUser/userContext';

type CreateEditItemFormProps = {
  formik: FormikContextType<IItem>;
  fileUploadPercent: number | null;
  imageFile: File | null;
  onImageFileChange: (value: File | null) => void;
  isLoading: boolean;
  isEdit?: boolean;
};

const CreateEditItemForm = ({
  formik,
  fileUploadPercent,
  imageFile,
  onImageFileChange,
  isLoading,
  isEdit = false,
}: CreateEditItemFormProps) => {
  const { documentUser } = useUserContext();

  const updateUserCategoryMutation = useUpdateUserCategoryMutation();

  const [categoryOptions, setCategoryOptions] = useState<
    CreatableAutocompleteOption[]
  >([]);

  useEffect(() => {
    setCategoryOptions(
      documentUser?.categories?.map(c => ({ value: c })) ?? [],
    );
  }, [documentUser?.categories]);

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

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      onImageFileChange(event.target.files[0]);
    },
    [onImageFileChange],
  );

  const handleFileRemove = useCallback(
    () => onImageFileChange(null),
    [onImageFileChange],
  );

  const handleFormReset = useCallback(() => {
    formik.resetForm();
    handleFileRemove();
  }, [formik, handleFileRemove]);

  return (
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
        <Grid item xs={12} md={3}>
          <FormikTextField
            name="price"
            label="Price"
            formik={formik}
            inputProps={{ variant: 'standard', fullWidth: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormikSelect
            formik={formik}
            name="rating"
            label="Rating"
            options={itemRatingOptions.map(p => ({ name: p, value: p }))}
            inputProps={{
              fullWidth: true,
              variant: 'standard',
            }}
          />
        </Grid>
        <Grid item xs={12} md={10}>
          <FormikTextField
            name="primaryImageUrl"
            label="Primary Image URL"
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
        {formik.values.primaryImageUrl &&
          !imageFile &&
          formik.values.primaryImageUrl !==
            formik.initialValues.primaryImageUrl && (
            <Grid item xs={12}>
              <Typography variant="caption">Preview</Typography>
              <img
                src={formik.values.primaryImageUrl}
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
            <LinearProgress value={fileUploadPercent} variant="determinate" />
          </Grid>
        )}
        <Grid item>
          <LoadingButton
            type="submit"
            loading={isLoading}
            variant="contained"
            disableElevation
          >
            Save
          </LoadingButton>
        </Grid>
        <Grid item>
          {!isEdit && (
            <Link href="/stash/items" passHref>
              <Button
                disabled={isLoading}
                variant="outlined"
                color="error"
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Link>
          )}
          {isEdit && (
            <Button
              disabled={isLoading}
              variant="outlined"
              color="error"
              sx={{ ml: 2 }}
              onClick={handleFormReset}
            >
              Reset
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateEditItemForm;

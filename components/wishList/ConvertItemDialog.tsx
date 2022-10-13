/* eslint-disable @next/next/no-img-element */

import { Button, Grid, Typography } from '@mui/material';
import React, { useCallback } from 'react';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { FullscreenDialog } from '../shared/FullscreenDialog';
import { LoadingButton } from '@mui/lab';
import { useConvertWishListItemMutation } from '../../lib/queries/wishList/wishListMutations';
import { useRouter } from 'next/router';
import { useSnackbarAlert } from '../shared/SnackbarAlert';
import { useUserContext } from '../../lib/hoc/withUser/userContext';
import { useWishListItemsContext } from './WishListItemsContext';

const ConvertItemDialog = () => {
  const { documentUser } = useUserContext();
  const router = useRouter();
  const snackbar = useSnackbarAlert();
  const { conversionItem, onConversionItemChange } = useWishListItemsContext();

  const convertMutation = useConvertWishListItemMutation();

  const handleClose = useCallback(() => {
    if (!onConversionItemChange) return;

    onConversionItemChange(undefined);
  }, [onConversionItemChange]);

  const handleToggleDeletion = useCallback(() => {
    if (!onConversionItemChange || !conversionItem) return;

    onConversionItemChange({
      ...conversionItem,
      includeDeletion: !conversionItem.includeDeletion,
    });
  }, [conversionItem, onConversionItemChange]);

  const handleAddClick = useCallback(async () => {
    if (!conversionItem || !documentUser) return;
    if (conversionItem?.includeDeletion) {
      const shouldContinue = confirm(
        'Are you sure? This will remove the item from your wish list and add it to your stash.',
      );
      if (!shouldContinue) return;
    }
    try {
      const itemId = await convertMutation.mutateAsync({
        wishListItem: conversionItem.item,
        userId: documentUser.userId,
        includeDeletion: conversionItem.includeDeletion,
      });
      snackbar.send('Added to stash', 'success');
      router.push(`/stash/items/${itemId}`);
    } catch (error) {
      console.log(error);
      snackbar.send('Error converting item', 'error');
    }
  }, [conversionItem, convertMutation, documentUser, router, snackbar]);

  const render = () => {
    if (!conversionItem) return null;

    const { item, includeDeletion } = conversionItem;

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">
            Nice! Now that you have this item, feel free to add it to your
            stash.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{item.name}</Typography>
        </Grid>
        <Grid item xs={12}>
          <img
            src={item.image}
            style={{
              height: '200px',
              width: '100%',
              objectFit: 'contain',
            }}
            alt={item.name}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            startIcon={
              includeDeletion ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />
            }
            onClick={handleToggleDeletion}
          >
            Remove from wish list
          </Button>
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            loading={convertMutation.isLoading}
            onClick={handleAddClick}
            variant="contained"
          >
            Add now
          </LoadingButton>
        </Grid>
      </Grid>
    );
  };

  return (
    <FullscreenDialog
      title="Got it!"
      open={!!conversionItem}
      onClose={handleClose}
      responsive
    >
      {render()}
    </FullscreenDialog>
  );
};

export default ConvertItemDialog;

/* eslint-disable @next/next/no-img-element */

import { Box, Button, Grid, Stack, Typography } from '@mui/material';

import { IItemWithId } from '../../../../../entities/item';
import React from 'react';
import { getItemPrimaryImageUrl } from '../../../../constants/images';

type ItemDetailKey =
  | 'name'
  | 'price'
  | 'description'
  | 'category'
  | 'rating'
  | 'createdAt'
  | 'updatedAt';

type ItemDetailProps = {
  item: IItemWithId;
  dataKey: ItemDetailKey;
  title: string;
};

const ItemDetail = ({ item, dataKey, title }: ItemDetailProps) => {
  const data = item[dataKey];
  console.log(data);

  if (!data) return null;

  let content;
  if (typeof data === 'string') {
    content = data;
  } else if (typeof data === 'number') {
    content = data.toLocaleString();
  } else {
    content = data.toLocaleDateString();
  }

  return (
    <Grid item>
      <Stack>
        <Typography variant="overline">{title}</Typography>
        <Typography variant="body1">{content}</Typography>
      </Stack>
    </Grid>
  );
};

type ItemsTabViewItemProps = {
  item: IItemWithId;
  isOwner: boolean;
};

const ItemsTabViewItem = ({ item, isOwner }: ItemsTabViewItemProps) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} display="flex" alignItems="center">
        <Box>
          <Typography variant="h4">{item.name}</Typography>
        </Box>
        {isOwner && (
          <Box ml="auto">
            <Button
              href={`${window.location.origin}/stash/items/${item.id}`}
              target="_blank"
              rel="noreferrer"
            >
              Edit
            </Button>
          </Box>
        )}
      </Grid>
      <Grid item xs={12} textAlign="center">
        <img
          src={getItemPrimaryImageUrl(item)}
          style={{ objectFit: 'contain', maxWidth: '100%' }}
          alt={item.name}
        />
      </Grid>
      <ItemDetail item={item} dataKey="category" title="Category" />
      <ItemDetail item={item} dataKey="description" title="Description" />
      <ItemDetail item={item} dataKey="rating" title="Rating" />
      <ItemDetail item={item} dataKey="createdAt" title="Created" />
      <ItemDetail item={item} dataKey="updatedAt" title="Updated" />
    </Grid>
  );
};

export default ItemsTabViewItem;

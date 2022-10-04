import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Fade,
} from '@mui/material';

import { IItemWithId } from '../../../entities/item';
import Link from 'next/link';
import React from 'react';
import { getItemPrimaryImageUrl } from '../../constants/images';

type ItemsListItemProps = {
  item: IItemWithId;
};

const ItemsListItem = ({ item }: ItemsListItemProps) => {
  return (
    <Fade in timeout={500}>
      <Card sx={{ height: '100%' }} elevation={4}>
        <Link href={`/stash/items/${item.id}`} passHref>
          <CardActionArea sx={{ display: 'flex', justifyContent: 'start' }}>
            <CardMedia
              component="img"
              image={getItemPrimaryImageUrl(item)}
              alt={item.name}
              sx={{
                objectFit: 'contain',
                height: '150px',
                minWidth: '200px',
                maxWidth: '200px',
              }}
            />
            <CardContent>{item.name}</CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </Fade>
  );
};

export default ItemsListItem;

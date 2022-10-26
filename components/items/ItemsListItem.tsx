import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Fade,
  Typography,
} from '@mui/material';

import { IItemWithId } from '../../entities/item';
import Link from 'next/link';
import React from 'react';
import { appRoutes } from '../../lib/constants/routes';
import { getItemPrimaryImageUrl } from '../../lib/constants/images';

type ItemsListItemProps = {
  item: IItemWithId;
};

const ItemsListItem = ({ item }: ItemsListItemProps) => {
  return (
    <Fade in timeout={500}>
      <Card sx={{ height: '100%' }} elevation={4}>
        <Link href={appRoutes.stash.items.view.path(item.id)} passHref>
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
                p: 1,
              }}
            />
            <CardContent>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2">{item.category}</Typography>
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </Fade>
  );
};

export default ItemsListItem;

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Fade,
} from '@mui/material';

import { ICollectionWithId } from '../../../entities/collection';
import Link from 'next/link';
import React from 'react';

type CollectionsListItemProps = {
  collection: ICollectionWithId;
};

const CollectionsListItem = ({ collection }: CollectionsListItemProps) => {
  return (
    <Fade in timeout={500}>
      <Card sx={{ height: '100%' }}>
        <Link href={`/stash/collections/${collection.id}`} passHref>
          <CardActionArea>
            <CardMedia
              component="img"
              image={collection.coverImageUrl}
              alt={collection.name}
              height="300"
              sx={{ objectFit: 'contain', backgroundColor: 'black' }}
            />
            <CardContent>{collection.name}</CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </Fade>
  );
};

export default CollectionsListItem;

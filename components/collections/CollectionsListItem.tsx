import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Fade,
  Tooltip,
  Typography,
} from '@mui/material';

import { Box } from '@mui/system';
import { ICollectionWithId } from '../../entities/collection';
import Link from 'next/link';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import React from 'react';
import { appRoutes } from '../../lib/constants/routes';
import { getCollectionCoverImageUrl } from '../../lib/constants/images';

type CollectionsListItemProps = {
  collection: ICollectionWithId;
};

const CollectionsListItem = ({ collection }: CollectionsListItemProps) => {
  return (
    <Fade in timeout={500}>
      <Card sx={{ height: '100%' }} elevation={4}>
        <Link
          href={appRoutes.stash.collections.view.path(collection.id)}
          passHref
        >
          <CardActionArea>
            <CardMedia
              component="img"
              image={getCollectionCoverImageUrl(collection)}
              alt={collection.name}
              height="300"
              sx={{ objectFit: 'contain', p: 1 }}
            />
            <CardContent sx={{ display: 'flex' }}>
              <Box>
                <Typography variant="h6">{collection.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {collection.itemIds.length} item(s)
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Tooltip title={collection.isPublic ? 'Public' : 'Private'}>
                  {collection.isPublic ? <PublicIcon /> : <PublicOffIcon />}
                </Tooltip>
              </Box>
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </Fade>
  );
};

export default CollectionsListItem;

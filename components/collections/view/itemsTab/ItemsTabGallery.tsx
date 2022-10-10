/* eslint-disable @next/next/no-img-element */

import {
  Fade,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { Fragment } from 'react';

import { IItemWithId } from '../../../../entities/item';
import InfoIcon from '@mui/icons-material/Info';
import { getItemPrimaryImageUrl } from '../../../../lib/constants/images';

type ItemsTabGalleryProps = {
  items: IItemWithId[];
  onItemClick: (id: string) => void;
};

const ItemsTabGallery = ({ items, onItemClick }: ItemsTabGalleryProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Fragment>
      <ImageList cols={isSmallScreen ? 1 : 3} gap={6}>
        {items.map(item => (
          <Fade key={item.id} in timeout={500}>
            <ImageListItem
              sx={{
                border: '2px solid',
                borderColor: 'primary.light',
                borderRadius: `${theme.shape.borderRadius}px`,
              }}
            >
              <img
                src={getItemPrimaryImageUrl(item)}
                style={{
                  objectFit: 'contain',
                }}
                alt={item.name}
              />
              <ImageListItemBar
                title={item.name}
                subtitle={item.category}
                actionIcon={
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    onClick={() => onItemClick(item.id)}
                  >
                    <InfoIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          </Fade>
        ))}
      </ImageList>
    </Fragment>
  );
};

export default ItemsTabGallery;

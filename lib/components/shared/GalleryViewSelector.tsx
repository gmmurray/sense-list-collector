import { IconButton, Tooltip } from '@mui/material';
import React, { Fragment } from 'react';

import CollectionsIcon from '@mui/icons-material/Collections';
import ViewListIcon from '@mui/icons-material/ViewList';

type GalleryViewSelectorProps = {
  isGalleryView: boolean;
  onGalleryViewChange: (value: boolean) => any;
};

const GalleryViewSelector = ({
  isGalleryView,
  onGalleryViewChange,
}: GalleryViewSelectorProps) => {
  return (
    <Fragment>
      <Tooltip title="Gallery view">
        <IconButton
          color={isGalleryView ? 'primary' : undefined}
          onClick={() => onGalleryViewChange(true)}
        >
          <CollectionsIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Table view">
        <IconButton
          color={!isGalleryView ? 'primary' : undefined}
          onClick={() => onGalleryViewChange(false)}
        >
          <ViewListIcon />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
};

export default GalleryViewSelector;

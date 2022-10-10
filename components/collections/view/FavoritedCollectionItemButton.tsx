import { IconButton, IconButtonProps, Tooltip } from '@mui/material';

import React from 'react';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

type FavoritedCollectionItemButtonProps = {
  selected?: boolean;
  disabled?: boolean;
  size?: IconButtonProps['size'];
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => any;
};

const FavoritedCollectionItemButton = ({
  onClick,
  disabled = false,
  selected = false,
  size = 'small',
}: FavoritedCollectionItemButtonProps) => {
  const FavoriteIcon = selected ? StarIcon : StarBorderIcon;
  const tooltipTitle = selected ? 'Remove from favorites' : 'Add to favorites';
  return (
    <Tooltip title={tooltipTitle}>
      <IconButton onClick={e => onClick(e)} disabled={disabled} size={size}>
        <FavoriteIcon color="warning" />
      </IconButton>
    </Tooltip>
  );
};

export default FavoritedCollectionItemButton;

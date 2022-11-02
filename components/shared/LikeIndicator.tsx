import { Box } from '@mui/system';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import Typography from '@mui/material/Typography';
import { pluralWord } from '../../lib/helpers/pluralWord';

type Props = {
  isLiked: boolean;
  numLikes: number;
  onClick: (isAdditive: boolean) => any;
  enabled: boolean;
};

export default function LikeIndicator({
  isLiked,
  numLikes = 0,
  onClick,
  enabled = false,
}: Props) {
  const icon = isLiked ? (
    <FavoriteIcon color="primary" />
  ) : (
    <FavoriteBorderIcon color="primary" />
  );
  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={() => onClick(!isLiked)} disabled={!enabled}>
        {icon}
      </IconButton>
      {numLikes > 0 && (
        <Typography variant="overline">
          {numLikes} {pluralWord('like', numLikes > 1)}
        </Typography>
      )}
    </Box>
  );
}

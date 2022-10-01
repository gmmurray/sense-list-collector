import {
  BoxProps,
  CircularProgress,
  CircularProgressProps,
} from '@mui/material';

import { Box } from '@mui/system';
import React from 'react';

const DEFAULT_HEIGHT = '300px';
const DEFAULT_SIZE = 60;

type CenteredLoadingIndicatorProps = {
  height?: BoxProps['height'];
  size?: CircularProgressProps['size'];
};

const CenteredLoadingIndicator = ({
  height,
  size = DEFAULT_SIZE,
}: CenteredLoadingIndicatorProps) => {
  return (
    <Box
      // @ts-ignore
      height={height}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default CenteredLoadingIndicator;

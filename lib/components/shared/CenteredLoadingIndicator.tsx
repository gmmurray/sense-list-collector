import { Box } from '@mui/system';
import { CircularProgress } from '@mui/material';
import React from 'react';

const CenteredLoadingIndicator = () => {
  return (
    <Box
      height="300px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default CenteredLoadingIndicator;

import { Box, Typography } from '@mui/material';

import React from 'react';

type CenteredMessageProps = {
  message: string;
};

const CenteredMessage = ({ message }: CenteredMessageProps) => {
  return (
    <Box
      height="300px"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h5" component="h5" textAlign="center">
        {message}
      </Typography>
    </Box>
  );
};

export default CenteredMessage;

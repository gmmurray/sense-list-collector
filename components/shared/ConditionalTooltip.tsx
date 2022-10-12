import React, { ReactElement } from 'react';

import { Tooltip } from '@mui/material';

const ConditionalTooltip = ({
  children,
  title,
  visible = false,
}: {
  visible: boolean;
  children: ReactElement;
  title?: string;
}) => {
  if (visible && title) {
    return <Tooltip title={title}>{children}</Tooltip>;
  }
  return children;
};

export default ConditionalTooltip;

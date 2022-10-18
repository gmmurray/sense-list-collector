import { IconButton, Tooltip } from '@mui/material';
import React, { Fragment } from 'react';

import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

type GridViewSelectorProps = {
  isGridView: boolean;
  onGridViewChange: (value: boolean) => any;
};

const GridViewSelector = ({
  isGridView,
  onGridViewChange,
}: GridViewSelectorProps) => {
  return (
    <Fragment>
      <Tooltip title="Grid view">
        <IconButton
          color={isGridView ? 'secondary' : undefined}
          onClick={() => onGridViewChange(true)}
        >
          <GridViewIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Table view">
        <IconButton
          color={!isGridView ? 'secondary' : undefined}
          onClick={() => onGridViewChange(false)}
        >
          <ViewListIcon />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
};

export default GridViewSelector;

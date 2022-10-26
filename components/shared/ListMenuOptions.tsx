import { Menu, MenuItem } from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box } from '@mui/system';
import React from 'react';
import { SortDir } from '../../lib/types/sort';

type ListMenuOptionsProps<T> = {
  options: {
    title: string;
    value: T;
    selected: boolean;
  }[];
  anchor: HTMLElement | null;
  onClose: () => any;
  onOptionClick: (value: T) => any;
  showSortIcon?: boolean;
  sortDir?: SortDir;
};

function ListMenuOptions<T>({
  options,
  anchor,
  onClose,
  onOptionClick,
  showSortIcon = false,
  sortDir,
}: ListMenuOptionsProps<T>) {
  const sortIcon =
    sortDir === 'desc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />;
  const renderItemContent = (title: string, selected: boolean) => {
    if (showSortIcon && sortDir) {
      return (
        <Box display="flex" width="100%">
          <Box>{title}</Box>
          {selected && <Box ml="auto">{sortIcon}</Box>}
        </Box>
      );
    }

    return <>{title}</>;
  };
  return (
    <Menu anchorEl={anchor} open={!!anchor} onClose={onClose}>
      {options.map((option, index) => (
        <MenuItem
          key={index}
          onClick={() => onOptionClick(option.value)}
          selected={option.selected}
        >
          {renderItemContent(option.title, option.selected)}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default ListMenuOptions;

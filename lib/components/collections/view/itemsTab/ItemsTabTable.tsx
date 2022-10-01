import {
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { IItemWithId } from '../../../../../entities/item';
import React from 'react';

type ItemsTabTableProps = {
  items: IItemWithId[];
  onItemClick: (id: string) => void;
};

const ItemsTabTable = ({ items, onItemClick }: ItemsTabTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Rating</TableCell>
            <TableCell align="right">Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(item => (
            <Fade key={item.id} in timeout={500}>
              <TableRow
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                }}
                onClick={() => onItemClick(item.id)}
              >
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.category ?? '--'}</TableCell>
                <TableCell align="right">{item.rating ?? '--'}</TableCell>
                <TableCell align="right">
                  {item.createdAt.toLocaleString()}
                </TableCell>
              </TableRow>
            </Fade>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemsTabTable;

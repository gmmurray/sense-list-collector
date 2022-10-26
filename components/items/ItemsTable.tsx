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
import React, { useCallback } from 'react';

import { IItemWithId } from '../../entities/item';
import { appRoutes } from '../../lib/constants/routes';
import { getDateStringFromFirestoreTimestamp } from '../../lib/helpers/firestoreHelpers';
import { useRouter } from 'next/router';

const nullableFieldTemplate = (value?: string | number) => {
  if (!value || (typeof value === 'number' && value === 0)) return '--';

  return value;
};

type ItemsTableProps = {
  items: IItemWithId[];
};

const ItemsTable = ({ items }: ItemsTableProps) => {
  const router = useRouter();
  const handleRowClick = useCallback(
    (id: string) => () => router.push(appRoutes.stash.items.view.path(id)),
    [router],
  );
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Rating</TableCell>
            <TableCell align="right">Price ($)</TableCell>
            <TableCell align="right">Collection(s)</TableCell>
            <TableCell align="right">Last updated</TableCell>
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
                onClick={handleRowClick(item.id)}
              >
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">
                  {nullableFieldTemplate(item.category)}
                </TableCell>
                <TableCell align="right">
                  {nullableFieldTemplate(item.rating)}
                </TableCell>
                <TableCell align="right">
                  {nullableFieldTemplate(item.price)}
                </TableCell>
                <TableCell align="right">
                  {nullableFieldTemplate(item.collectionIds?.length)}
                </TableCell>
                <TableCell align="right">
                  {getDateStringFromFirestoreTimestamp(item.updatedAt)}
                </TableCell>
                <TableCell align="right">
                  {getDateStringFromFirestoreTimestamp(item.createdAt)}
                </TableCell>
              </TableRow>
            </Fade>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemsTable;

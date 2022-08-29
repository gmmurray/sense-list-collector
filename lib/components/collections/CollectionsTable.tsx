import {
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import React, { Fragment, useCallback } from 'react';

import { ICollectionWithId } from '../../../entities/collection';
import Link from 'next/link';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import { useRouter } from 'next/router';

type CollectionsTableProps = {
  collections: ICollectionWithId[];
};

const CollectionsTable = ({ collections }: CollectionsTableProps) => {
  const router = useRouter();
  const handleRowClick = useCallback(
    (id: string) => () => router.push(`/stash/collections/${id}`),
    [router],
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Public</TableCell>
            <TableCell align="right">Items</TableCell>
            <TableCell align="right">Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {collections.map(c => (
            <Fade key={c.id} in timeout={500}>
              <TableRow
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                }}
                onClick={handleRowClick(c.id)}
              >
                <TableCell component="th" scope="row">
                  {c.name}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={c.isPublic ? 'Public' : 'Private'}>
                    {c.isPublic ? <PublicIcon /> : <PublicOffIcon />}
                  </Tooltip>
                </TableCell>
                <TableCell align="right">{c.itemIds?.length ?? 0}</TableCell>
                <TableCell align="right">
                  {new Date(c.updatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            </Fade>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollectionsTable;

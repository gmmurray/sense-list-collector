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
import React, { useCallback } from 'react';

import { ICollectionWithId } from '../../entities/collection';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import { appRoutes } from '../../lib/constants/routes';
import { getDateStringFromFirestoreTimestamp } from '../../lib/helpers/firestoreHelpers';
import { useRouter } from 'next/router';

type CollectionsTableProps = {
  collections: ICollectionWithId[];
};

const CollectionsTable = ({ collections }: CollectionsTableProps) => {
  const router = useRouter();
  const handleRowClick = useCallback(
    (id: string) => () =>
      router.push(appRoutes.stash.collections.view.path(id)),
    [router],
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Public</TableCell>
            <TableCell align="right">Item(s)</TableCell>
            <TableCell align="right">Last updated</TableCell>
            <TableCell align="right">Created</TableCell>
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
                  {getDateStringFromFirestoreTimestamp(c.updatedAt)}
                </TableCell>
                <TableCell align="right">
                  {getDateStringFromFirestoreTimestamp(c.createdAt)}
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

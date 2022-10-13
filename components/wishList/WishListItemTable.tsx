import {
  Button,
  Fade,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import {
  IWishListItem,
  getOwnedItemStatusColor,
} from '../../entities/wishList';
import React, { useCallback } from 'react';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LinkIcon from '@mui/icons-material/Link';
import { useWishListItemsContext } from './WishListItemsContext';

type WishListItemTableProps = {
  items: IWishListItem[];
};

const WishListItemTable = ({ items }: WishListItemTableProps) => {
  const theme = useTheme();
  const { onEditorToggle, onDelete, editorLoading } = useWishListItemsContext();

  const handleLinkClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, link: string) => {
      event.stopPropagation();
      window.open(link, '_blank');
    },
    [],
  );

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
      event.stopPropagation();

      if (!onDelete) return;

      onDelete(id);
    },
    [onDelete],
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Category</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Priority</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, key) => (
            <Fade key={key} in timeout={500}>
              <TableRow
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                  bgcolor:
                    item.status === 'own'
                      ? getOwnedItemStatusColor(theme)
                      : undefined,
                }}
                onClick={() => onEditorToggle!(true, item)}
              >
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.status ?? '--'}</TableCell>
                <TableCell align="right">{item.category ?? '--'}</TableCell>
                <TableCell align="right">
                  {item.price ? `$${item.price}` : '--'}
                </TableCell>
                <TableCell align="right">{item.priority ?? '--'}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="info"
                    onClick={e => handleLinkClick(e, item.link)}
                  >
                    <LinkIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    disabled={editorLoading}
                    onClick={e => handleDeleteClick(e, item.id)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </Fade>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WishListItemTable;

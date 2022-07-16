import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Fade,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';

import { Box } from '@mui/system';
import { IWishListItem } from '../../../entities/wishList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import React from 'react';
import { useWishListItemsContext } from './WishListItemsContext';

const getPriorityIcon = (priority: IWishListItem['priority']) => {
  let icon: JSX.Element | null = null;

  if (priority === 'low') icon = <KeyboardArrowDownIcon color="success" />;
  else if (priority === 'medium')
    icon = <KeyboardArrowUpIcon color="warning" />;
  else if (priority === 'high')
    icon = <KeyboardDoubleArrowUpIcon color="error" />;

  if (icon) {
    return <Tooltip title={`${priority} priority`}>{icon}</Tooltip>;
  } else {
    return null;
  }
};

type WishListItemProps = {
  item: IWishListItem;
};

const WishListItem = ({ item }: WishListItemProps) => {
  const itemsContext = useWishListItemsContext();

  return (
    <Fade in timeout={500}>
      <Card sx={{ height: '100%' }}>
        <a href={item.link} target="_blank" rel="noreferrer">
          <CardMedia
            component="img"
            image={item.image}
            alt={item.name}
            height="200"
            sx={{ objectFit: 'contain', backgroundColor: 'black' }}
          />
        </a>
        <Box display="flex" flexDirection="column" height="calc(100% - 200px)">
          <CardContent
            sx={{
              pb: 0,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="overline">
                  {item.category ?? 'no category'}
                </Typography>
              </Grid>
              <Grid item xs={11}>
                <Typography gutterBottom variant="h6" component="div">
                  {item.name}
                </Typography>
              </Grid>
              {item.priority && (
                <Grid item sx={{ ml: 'auto' }}>
                  {getPriorityIcon(item.priority)}
                </Grid>
              )}
            </Grid>
            <Typography sx={{ mb: 1.5, mt: 'auto' }} color="text.secondary">
              ${item.price === undefined ? '--' : item.price}
            </Typography>
          </CardContent>
          <CardActions sx={{ mt: 'auto' }}>
            <Button
              size="small"
              onClick={() => itemsContext.onEditorToggle!(true, item)}
            >
              view
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => itemsContext.onDelete!(item.id)}
              disabled={itemsContext.editorLoading}
            >
              remove
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Fade>
  );
};

export default WishListItem;

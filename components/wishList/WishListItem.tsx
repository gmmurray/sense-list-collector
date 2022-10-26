import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Fade,
  Grid,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  IWishListItem,
  getOwnedItemStatusColor,
} from '../../entities/wishList';
import React, { useCallback } from 'react';

import { Box } from '@mui/system';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { LoadingButton } from '@mui/lab';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import { useWishListItemsContext } from './WishListItemsContext';

const getPriorityIcon = (
  priority: IWishListItem['priority'],
  status: IWishListItem['status'],
) => {
  let icon: JSX.Element | null = null;

  if (status === 'own') {
    icon = <CheckIcon color="success" />;
  } else {
    if (priority === undefined) return null;
    if (priority === 'low') icon = <KeyboardArrowDownIcon color="success" />;
    else if (priority === 'medium')
      icon = <KeyboardArrowUpIcon color="warning" />;
    else if (priority === 'high')
      icon = <KeyboardDoubleArrowUpIcon color="error" />;
  }

  if (icon) {
    let title = status === 'own' ? 'Already owned' : `${priority} priority`;

    return <Tooltip title={title}>{icon}</Tooltip>;
  } else {
    return null;
  }
};

type WishListItemProps = {
  item: IWishListItem;
};

const WishListItem = ({ item }: WishListItemProps) => {
  const itemsContext = useWishListItemsContext();
  const theme = useTheme();

  const handleStatusChange = useCallback(() => {
    if (!itemsContext.onItemStatusChange) return;

    const newStatus = item.status === 'own' ? 'need' : 'own';
    itemsContext.onItemStatusChange(item.id, newStatus);
  }, [item.id, item.status, itemsContext]);

  return (
    <Fade in timeout={500}>
      <Card
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        elevation={4}
      >
        <CardActionArea
          onClick={() => itemsContext.onEditorToggle!(true, item)}
          sx={{ flex: 1 }}
        >
          <CardMedia
            component="img"
            image={item.image}
            alt={item.name}
            height="200"
            sx={{ objectFit: 'contain', p: 1 }}
          />
          <Box
            display="flex"
            flexDirection="column"
            height="calc(100% - 200px)"
          >
            <CardContent
              sx={{
                pb: '0 !important',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor:
                  item.status === 'own'
                    ? getOwnedItemStatusColor(theme)
                    : undefined,
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
                <Grid item sx={{ ml: 'auto' }}>
                  {getPriorityIcon(item.priority, item.status)}
                </Grid>
              </Grid>
              <Typography sx={{ mb: 1.5, mt: 'auto' }} color="text.secondary">
                {item.price === undefined ? '--' : `$${item.price}`}
              </Typography>
            </CardContent>
          </Box>
        </CardActionArea>
        <CardActions
          sx={{
            mt: 'auto',
            bgcolor:
              item.status === 'own'
                ? getOwnedItemStatusColor(theme)
                : undefined,
          }}
        >
          <Tooltip
            title={item.status === 'own' ? 'Mark as needed' : 'Mark as owned'}
          >
            <LoadingButton
              size="small"
              loading={itemsContext.singleItemLoading === item.id}
              onClick={handleStatusChange}
            >
              {item.status === 'own' ? <RemoveDoneIcon /> : <CheckIcon />}
            </LoadingButton>
          </Tooltip>
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Button size="small" color="secondary">
              View link
            </Button>
          </a>
          <Button
            size="small"
            color="warning"
            onClick={() => itemsContext.onDelete!(item.id)}
            disabled={itemsContext.editorLoading}
            sx={{ ml: 2 }}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </Fade>
  );
};

export default WishListItem;

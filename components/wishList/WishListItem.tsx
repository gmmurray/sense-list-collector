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
import React, { useCallback } from 'react';

import { Box } from '@mui/system';
import CheckIcon from '@mui/icons-material/Check';
import { IWishListItem } from '../../entities/wishList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { LoadingButton } from '@mui/lab';
import { useWishListItemsContext } from './WishListItemsContext';

const getPriorityIcon = (
  priority: IWishListItem['priority'],
  status: IWishListItem['status'],
) => {
  let icon: JSX.Element | null = null;

  if (status === 'own') {
    icon = <CheckIcon color="success" />;
  } else {
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

const getOwnStatusColor = (theme: Theme) => theme.palette.success.light + '60';

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
      <Card sx={{ height: '100%' }} elevation={4}>
        <CardActionArea
          onClick={() => itemsContext.onEditorToggle!(true, item)}
        >
          <CardMedia
            component="img"
            image={item.image}
            alt={item.name}
            height="200"
            sx={{ objectFit: 'contain' }}
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
                  item.status === 'own' ? getOwnStatusColor(theme) : undefined,
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
                    {getPriorityIcon(item.priority, item.status)}
                  </Grid>
                )}
              </Grid>
              <Typography sx={{ mb: 1.5, mt: 'auto' }} color="text.secondary">
                ${item.price === undefined ? '--' : item.price}
              </Typography>
            </CardContent>
          </Box>
        </CardActionArea>
        <CardActions
          sx={{
            mt: 'auto',
            bgcolor:
              item.status === 'own' ? getOwnStatusColor(theme) : undefined,
          }}
        >
          <LoadingButton
            size="small"
            loading={itemsContext.singleItemLoading === item.id}
            onClick={handleStatusChange}
          >
            {item.status === 'own' ? 'Still need' : 'Own it'}
          </LoadingButton>
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Button size="small">View link</Button>
          </a>
          <Button
            size="small"
            color="error"
            onClick={() => itemsContext.onDelete!(item.id)}
            disabled={itemsContext.editorLoading}
            sx={{ ml: 2 }}
          >
            remove
          </Button>
        </CardActions>
      </Card>
    </Fade>
  );
};

export default WishListItem;

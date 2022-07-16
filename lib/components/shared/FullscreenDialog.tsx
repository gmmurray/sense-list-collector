import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { Container } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

type FullscreenDialogProps = {
  title: string;
  open: boolean;
  onClose: () => any;
  action?: (params: any) => any;
} & React.PropsWithChildren;

export const FullscreenDialog = ({
  title,
  open,
  onClose,
  action,
  children,
}: FullscreenDialogProps) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative', mb: 2 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          {action && (
            <Button autoFocus color="inherit" onClick={action}>
              save
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">{children}</Container>
    </Dialog>
  );
};

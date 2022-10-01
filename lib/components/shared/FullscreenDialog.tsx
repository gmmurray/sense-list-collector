import * as React from 'react';

import { useMediaQuery, useTheme } from '@mui/material';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { Container } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
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
  responsive?: boolean;
  transition?: 'slide' | 'default';
} & React.PropsWithChildren;

export const FullscreenDialog = ({
  title,
  open,
  onClose,
  action,
  responsive = false,
  transition = 'slide',
  children,
}: FullscreenDialogProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const fullScreen = !responsive || isSmallScreen;

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      TransitionComponent={transition === 'slide' ? Transition : undefined}
      PaperProps={{
        sx: {
          minHeight: fullScreen ? undefined : '50vh',
          minWidth: fullScreen ? undefined : '50vw',
          maxWidth: fullScreen ? undefined : '85vw',
        },
      }}
    >
      <AppBar sx={{ mb: 2 }} position="sticky">
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
      <Container maxWidth="xl" sx={{ mb: 2 }}>
        {children}
      </Container>
    </Dialog>
  );
};

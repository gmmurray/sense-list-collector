import { Alert, Snackbar } from '@mui/material';
import { createContext, useCallback, useContext, useState } from 'react';

type SnackbarAlertType = 'error' | 'warning' | 'info' | 'success';

type SnackbarAlertContextValue = {
  send: (message: string, type: SnackbarAlertType) => void;
  onClose: () => void;
};

const initialValue: SnackbarAlertContextValue = {
  send: () => {},
  onClose: () => {},
};

export const SnackbarAlertContext = createContext(initialValue);

export const useSnackbarAlert = () => useContext(SnackbarAlertContext);

export const SnackbarAlertProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('Alert');
  const [type, setType] = useState<SnackbarAlertType>('info');

  const handleOpen = useCallback((message: string, type: SnackbarAlertType) => {
    setOpen(true);
    setMessage(message);
    setType(type);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const value: SnackbarAlertContextValue = {
    send: handleOpen,
    onClose: handleClose,
  };

  return (
    <SnackbarAlertContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ minWidth: '25%' }}
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarAlertContext.Provider>
  );
};

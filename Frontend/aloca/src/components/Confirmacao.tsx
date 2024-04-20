import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

interface ConfirmacaoProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  description: string;
}

export default function Confirmacao({ open, setOpen, description }: ConfirmacaoProps) {
React.useEffect(() => {
  if (open) {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [open, setOpen]);


    const handleClose = () => {
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        Fechar
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={description}
        action={action}
      />
    </div>
  );
}

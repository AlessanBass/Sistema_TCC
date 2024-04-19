import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

interface ConfirmacaoProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Confirmacao({ open, setOpen }: ConfirmacaoProps) {
  /* const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(true);
  }; */
/*   const [open, setOpenState] = React.useState(true);
 */
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
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Professor Cadastrado com Sucesso!"
        action={action}
      />
    </div>
  );
}

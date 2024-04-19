import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '@/styles/modal.module.css'
import FormCadastroProfessor from './FormCadastroProfessor';
import axios from 'axios';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface Area {
    id_area: number;
    nome_area: string;
}

export default function ModalProfessorCreate() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [areas, setAreas] = React.useState<Area[]>([]);
  /* Buscando as áreas */
  React.useEffect(()=>{
    const fetchData = async() =>{
      try{
        const response = await axios.get<Area[]>("http://localhost:3000/area");
        setAreas(response.data);
        //console.log(areas)

      }catch(e){
        console.log(e)
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <Button onClick={handleOpen} className={`${styles.buttonModal}`}>Inserir</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        {/* `${styles.modal}` */}
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2" className={`${styles.titleModal}`}>
              Cadastro Professor
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <FormCadastroProfessor areas={areas} onClose={handleClose}/>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '@/styles/modal.module.css'
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { TextField, FormControl, InputLabel, MenuItem } from '@mui/material';
import Confirmacao from './Confirmacao';



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
  /* Teste com o form */
  const [nomeProfessor, setNomeProfessor] = React.useState('');
  const [observacoes, setObservacoes] = React.useState('');
  const [area_id_area, setArea] = React.useState('');
  const [openConfirmation, setOpenConfirmation] = React.useState(false);

  const handleNomeProfessorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNomeProfessor(event.target.value);
  };

  const handleObservacoesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setObservacoes(event.target.value);
  };

  const handleAreaChange = (event: SelectChangeEvent) => {
    setArea(event.target.value as string);
  }

  const handleSubmit = async () => {

    if (!nomeProfessor || !area_id_area) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/professor', {
        nomeProfessor,
        observacoes,
        area_id_area,
        // Inclua aqui outros campos conforme necessário
      });

      if (response.status === 201) {
        /* alert('Cadastro realizado com sucesso!'); */
        /*  onClose(); */
        setOpen(false);
        setOpenConfirmation(true);

        // Limpa os dados do formulário
        setNomeProfessor('');
        setObservacoes('');
        setArea('');

      } else {
        alert('Ocorreu um erro ao realizar o cadastro.');
      }
    } catch (error) {
      console.error('Erro ao realizar o cadastro:', error);
    }
  };
  /* Buscando as áreas */
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Area[]>("http://localhost:3000/area");
        setAreas(response.data);
        //console.log(areas)

      } catch (e) {
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
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '100%', margin: '10px auto 10px auto' },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  required
                  id="outlined-required"
                  label="Nome Professor"
                  name="nomeProfessor"
                  value={nomeProfessor}
                  onChange={handleNomeProfessorChange}
                /*  sx={{ width: '100%',  }} */
                />

                <TextField
                  id="outlined-required"
                  label="Observações"
                  name="observacoes"
                  value={observacoes}
                  onChange={handleObservacoesChange}
                />

                <FormControl sx={{
                  width: '100%',
                  margin: '10px auto 20px auto'
                }} required>
                  <InputLabel id="area-label">Área</InputLabel>
                  <Select
                    labelId="area-label"
                    id="area"
                    value={area_id_area}
                    name='area_id_area'
                    label="Área"
                    onChange={handleAreaChange}
                  >
                    {areas.map((area) => (
                      <MenuItem key={area.id_area} value={area.id_area}>
                        {area.nome_area}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Cadastrar
                </Button>

                
              </Box>
            </Typography>
          </Box>
        </Fade>
      </Modal>
      <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} /> {/* Adicione o componente de confirmação */}
    </div>
  );
}
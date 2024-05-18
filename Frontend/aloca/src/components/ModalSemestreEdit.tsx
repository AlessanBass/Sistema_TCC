import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '@/styles/modal.module.css'
import axios from 'axios';
import { TextField, FormControl, InputLabel, MenuItem } from '@mui/material';
import Confirmacao from './Confirmacao';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: 400, // Definindo a altura máxima do modal como 400 pixels
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    borderRadius: '10px',
};

interface Semestre {
    nome_semestre: string;
}

interface propsModal {
    openModalEdit: boolean;
    handleCloseEdit: () => void;
    id_semestre: number;
    semestre: Semestre;
}

export default function ModalSemestreEdit({ openModalEdit, handleCloseEdit, id_semestre, semestre }: propsModal) {
    const [nomeSemestre, setNomeSemestre] = React.useState(semestre.nome_semestre);
    const [openConfirmation, setOpenConfirmation] = React.useState(false);

    /* Atualizar sempre que um professor mudar */
    React.useEffect(() => {
        setNomeSemestre(semestre.nome_semestre);
    }, [semestre]);

    const handleNomeSemestreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNomeSemestre(event.target.value);
    };

    const handleSubmit = async () => {

        if (!nomeSemestre) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:3000/semestre/${id_semestre}`, {
                nomeSemestre,
            });

            if (response.status === 200) {
                /* alert('Atualizado com sucesso!'); */
                handleCloseEdit();
                setOpenConfirmation(true);

            } else {
                alert('Ocorreu um erro ao realizar o cadastro.');
            }
        } catch (error) {
            console.error('Erro ao realizar o cadastro:', error);
        }
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModalEdit}
                onClose={handleCloseEdit}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openModalEdit}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" className={`${styles.titleModal}`}>
                            Modo Edição
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
                                    label="Nome do Semestre"
                                    name="nomeSemestre"
                                    value={nomeSemestre}
                                    onChange={handleNomeSemestreChange}
                                />

                            </Box>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Atualizar
                            </Button>
                            <Button variant="contained" color="error" onClick={handleCloseEdit}>
                                Fechar
                            </Button>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
            <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description='Semestre Atualizado com Sucesso!' />
        </div>
    );
}
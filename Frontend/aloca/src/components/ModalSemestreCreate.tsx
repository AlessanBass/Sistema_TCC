import styles from '@/styles/modal.module.css'
import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { TextField, FormControl, InputLabel, MenuItem, Button } from '@mui/material';
import Confirmacao from './Confirmacao';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import disciplinaStyles from '@/styles/disciplinas.module.css';

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

/* toltipo customozadi */
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'green', // Defina a cor de fundo como verde
        color: 'white', // Defina a cor do texto como branca
        fontSize: 14, // Ajuste o tamanho da fonte conforme necessário
    },
}));

export default function ModalSemestreCreate() {
    const [open, setOpen] = React.useState(false);
    const [nomeSemestre, setNomeSemestre] = React.useState('');
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleNomeSemestreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNomeSemestre(event.target.value);
    };

    const handleSubmit = async () => {
        if (!nomeSemestre) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/semestre', {
                nomeSemestre,
            });

            if (response.status === 201) {
                handleClose();
                setOpenConfirmation(true);
                setNomeSemestre('');

            } else {
                alert('Ocorreu um erro ao realizar o cadastro.');
            }
        } catch (error) {
            console.error('Erro ao realizar o cadastro:', error);
        }
    }

    return (
        <div>
            <div className={`${disciplinaStyles.containnerButton}`}>
                <CustomTooltip title="Adicionar nova disciplina" placement="left">
                    <Button onClick={handleOpen} className={`${disciplinaStyles.posision}`}>+</Button>
                </CustomTooltip>
            </div>
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
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" className={`${styles.titleModal}`}>
                            Modo Criação
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
                                <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    Cadastrar
                                </Button>

                            </Box>
                            <Button variant="contained" color="error" onClick={handleClose}>
                                Fechar
                            </Button>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
            <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description='Semestre Cadastrado com Sucesso!' />
        </div>
    );
}
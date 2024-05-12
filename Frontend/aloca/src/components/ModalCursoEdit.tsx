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

interface Curso {
    nome_curso: string;
    tipo_curso: string;
}
interface propsModal {
    openModalEdit: boolean;
    handleCloseEdit: () => void;
    id_curso: number;
    curso : Curso;
}

export default function ModalCursoEdit({ openModalEdit, handleCloseEdit, id_curso, curso }: propsModal) {

    const [nomeCurso, setNomeCurso] = React.useState(curso.nome_curso);
    const [tipoCurso, setTipoCurso] = React.useState(curso.tipo_curso);
    const [openConfirmation, setOpenConfirmation] = React.useState(false);

    /* React.useEffect(() => {
        const setCursoId = async () => {
            try {
                const response = await axios.get<any>(`http://localhost:3000/curso/${id_curso}`);
                setCurso(response.data);
                setNomeCurso(response.data.nomeCurso);
                setTipoCurso(response.data.tipoCurso);
            } catch (e) {
                console.log(e)
            }
        }
        setCursoId();
    }, [id_curso]); */

     /* Atualizar sempre que um professor mudar */
     React.useEffect(() => {
        setNomeCurso(curso.nome_curso);
        setTipoCurso(curso.tipo_curso);
    }, [curso]);


    const handleNomeCursoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNomeCurso(event.target.value);
    };

    const handleTipoCursoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTipoCurso(event.target.value);
    };

    const handleSubmit = async () => {

        if (!nomeCurso || !tipoCurso) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:3000/curso/${id_curso}`, {
                nomeCurso,
                tipoCurso,
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
    }

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
                                    label="Nome do Curso"
                                    name="nomeCurso"
                                    value={nomeCurso}
                                    onChange={handleNomeCursoChange}
                                />

                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Tipo do Curso"
                                    name="tipoCurso"
                                    value={tipoCurso}
                                    onChange={handleTipoCursoChange}
                                />

                                <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    Atualizar
                                </Button>

                            </Box>
                            <Button variant="contained" color="error" onClick={handleCloseEdit}>
                                Fechar
                            </Button>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
            <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description='Curso Atualizado com Sucesso!'/>
        </div>
    );
}
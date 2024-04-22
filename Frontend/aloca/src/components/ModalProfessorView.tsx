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
import ViewProfessorInfo from './ViewProfessorInfo';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: 400, // Definindo a altura máxima do modal como 400 pixels
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    borderRadius: '10px',
};
interface Disciplina {
    id_disciplina: number;
    periodo: number;
    cod: string;
    nome_disciplina: string;
    carga_horaria: number;
    qtd_creditos: number;
    turma: string;
    curso_id_curso: number;
    area_id_area: number;
}

interface Alocacao {
    id_alocacao: number;
    observacoes_colegiado: string | null;
    disciplina_id_disciplina: number;
    professor_id_professor: number;
    semestre_id_semestre: number;
    disciplina: Disciplina;
}

interface Area {
    id_area: number;
    nome_area: string;
}

interface Professor {
    id_professor: number;
    nome_professor: string;
    observacoes: string;
    area_id_area: number;
    area: Area;
    alocacao: Alocacao[];
}

interface propsModal {
    open: boolean;
    handleClose: () => void;
    acao: number;
    id_professor: number;
}
export default function ModalProfessorView({ open, handleClose, acao, id_professor }: propsModal) {
    const [professor, setProfessor] = React.useState<Professor | null>(null);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<any>(`http://localhost:3000/professor/${id_professor}`);
                setProfessor(response.data);
                //console.log(professor);

            } catch (e) {
                console.log(e)
            }
        }

        fetchData();
    }, [id_professor]);


    return (
        <div>
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
                            {acao === 1 ? <h2>Modo Visualização</h2> : null}
                            {acao === 2 ? "Editando" : null}
                            {acao === 3 ? "Deletando" : null}
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
                                {acao === 1 && professor ? <ViewProfessorInfo professor={professor}/> : "Carregando..."}
                                {acao === 2 ? <h1>Editando {id_professor}</h1> : null}
                                {acao === 3 ? <h1>Delete {id_professor}</h1> : null}

                                <Button variant="contained" color="error" onClick={handleClose}>
                                    Fechar
                                </Button>


                            </Box>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
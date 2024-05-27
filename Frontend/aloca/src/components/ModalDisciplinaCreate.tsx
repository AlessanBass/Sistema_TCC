import styles from '@/styles/modal.module.css'
import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import axios from 'axios';
import { TextField, FormControl, InputLabel, MenuItem, Button, SelectChangeEvent, Select } from '@mui/material';
import Confirmacao from './Confirmacao';
import areas from '@/pages/areas';
import disciplinaStyles from '@/styles/disciplinas.module.css';


interface Curso {
    id_curso: number;
    nome_curso: string;
    tipo_curso: string;
}

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

export default function ModalDisciplinaCreate() {
    const [open, setOpen] = React.useState(false);
    const [description, setDescription] = React.useState('');
    const [periodo, setPeriodo] = React.useState('');
    const [cod, setCod] = React.useState('');
    const [nome_disciplina, setNomeDisciplina] = React.useState('');
    const [carga_horaria, setCargaHoraria] = React.useState('');
    const [cursos, setCursos] = React.useState<Curso[]>([]);
    const [qtd_creditos, setQtdCreditos] = React.useState('');
    const [curso_id_curso, setIdCurso] = React.useState('');
    const [area_id_area, setIdArea] = React.useState('');
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handlePeriodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPeriodo(event.target.value);
    };

    const handleCodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCod(event.target.value);
    };

    const handleNomeDisciplinaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNomeDisciplina(event.target.value);
    };

    const handleCargaHorariaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCargaHoraria(event.target.value);
    };

    const handleQtdCreditosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQtdCreditos(event.target.value);
    };

    const handleIDCursoChange = (event: SelectChangeEvent) => {
        setIdCurso(event.target.value as string);
        setIdArea(event.target.value as string);
    };

    /* Buscando os cursos */
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Curso[]>("http://localhost:3000/curso");
                setCursos(response.data);
                //console.log(areas)

            } catch (e) {
                console.log(e)
            }
        }

        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (!periodo || !cod || !nome_disciplina || !carga_horaria || !qtd_creditos || !curso_id_curso) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/disciplina', {
                periodo,
                cod,
                nome_disciplina,
                carga_horaria,
                qtd_creditos,
                curso_id_curso,
                area_id_area
                // Inclua aqui outros campos conforme necessário
            });

            if (response.status === 201) {
                setOpen(false);
                setOpenConfirmation(true);
                setDescription("Disciplina Criada Sucesso Disciplina!");
                setPeriodo('');
                setCod('');
                setNomeDisciplina('');
                setCargaHoraria('');
                setQtdCreditos('');
                setIdCurso('');
                setIdArea('');
            }

        } catch (error) {
            console.log(error);
            /*   setOpen(false); */
            setOpenConfirmation(true);
            setDescription("Erro ao criar a Disciplina! Verifique o nome e o código da disciplina");
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
                                    label="Período"
                                    name="periodo"
                                    type="number"
                                    value={periodo}
                                    onChange={handlePeriodoChange}
                                />

                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Código"
                                    name="cod"
                                    type='text'
                                    value={cod}
                                    onChange={handleCodChange}
                                />

                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Nome da Disciplina"
                                    name="nome_disciplina"
                                    type='text'
                                    value={nome_disciplina}
                                    onChange={handleNomeDisciplinaChange}
                                />

                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Carga Horária"
                                    name="carga_horaria"
                                    type="number"
                                    value={carga_horaria}
                                    onChange={handleCargaHorariaChange}
                                />

                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Quantidade de Créditos"
                                    name="qtd_creditos"
                                    type="number"
                                    value={qtd_creditos}
                                    onChange={handleQtdCreditosChange}
                                />

                                <FormControl sx={{
                                    width: '100%',
                                    margin: '10px auto 20px auto'
                                }} required>

                                    <InputLabel id="area-label">Curso</InputLabel>
                                    <Select
                                        labelId="area-label"
                                        id="curso"
                                        value={curso_id_curso}
                                        name='curso_id_curso'
                                        label="Curso"
                                        onChange={handleIDCursoChange}
                                    >
                                        {cursos.map((curso) => (
                                            <MenuItem key={curso.id_curso} value={curso.id_curso}>
                                                {curso.nome_curso}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            </Box>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Cadastrar
                            </Button>
                            <Button variant="contained" color="error" onClick={handleClose}>
                                Fechar
                            </Button>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
            <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description={description} />
        </div>
    );
}
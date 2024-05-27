import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '@/styles/modal.module.css'
import axios from 'axios';
import { TextField, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
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


interface Disciplina {
    id_disciplina: number;
    periodo: number;
    cod: string;
    nome_disciplina: string;
    carga_horaria: number;
    qtd_creditos: number;
    curso_id_curso: number;
    area_id_area: number;
}

interface Curso {
    id_curso: number;
    nome_curso: string;
    tipo_curso: string;
}

interface PropsModal {
    openModalEdit: boolean;
    handleCloseEdit: () => void;
    id_disciplina: number;
    disciplina: Disciplina;
}

export default function ModalDisciplinaEdit({ openModalEdit, handleCloseEdit, id_disciplina, disciplina }: PropsModal) {
    const [periodo, setPeriodo] = React.useState(+disciplina.periodo);
    const [cod, setCod] = React.useState(disciplina.cod);
    const [nome_disciplina, setNomeDisciplina] = React.useState(disciplina.nome_disciplina);
    const [carga_horaria, setCargaHoraria] = React.useState(disciplina.carga_horaria);
    const [qtd_creditos, setQtdCreditos] = React.useState(disciplina.qtd_creditos);
    const [curso_id_curso, setIdCurso] = React.useState(disciplina.curso_id_curso);
    const [area_id_area, setIdArea] = React.useState(disciplina.area_id_area);
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const [description, setDescription] = React.useState("");
    const [cursos, setCursos] = React.useState<Curso[]>([]);

    /* Atualizar sempre que uma disciplina mudar */
    React.useEffect(() => {
        setCod(disciplina.cod);
        setNomeDisciplina(disciplina.nome_disciplina);
        setCargaHoraria(disciplina.carga_horaria);
        setQtdCreditos(disciplina.qtd_creditos);
        setIdCurso(disciplina.curso_id_curso);
        setIdArea(disciplina.curso_id_curso);
    }, [disciplina]);


    const handlePeriodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPeriodo(+event.target.value);
    };

    const handleCodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCod(event.target.value);
    };

    const handleNomeDisciplinaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNomeDisciplina(event.target.value);
    };

    const handleCargaHorariaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCargaHoraria(+event.target.value);
    };

    const handleQtdCreditosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQtdCreditos(+event.target.value);
    };

    const handleIDCursoChange = (event: SelectChangeEvent) => {
        setIdCurso(+event.target.value);
        setIdArea(+event.target.value);
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
            const response = await axios.patch(`http://localhost:3000/disciplina/${id_disciplina}`, {
                periodo,
                cod,
                nome_disciplina,
                carga_horaria,
                qtd_creditos,
                curso_id_curso,
                area_id_area
            });

            if (response.status === 200) {
                /* alert('Atualizado com sucesso!'); */
                handleCloseEdit();
                setOpenConfirmation(true);
                setDescription("Disciplina Atulizada Com Sucesso");

            }
        } catch (error) {
           /*  console.error('Erro ao realizar o cadastro:', error); */
           setOpenConfirmation(true);
           setDescription("Erro ao Atualizar a Disciplina! Verifique o nome e o código da disciplina");
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
                                        value={curso_id_curso.toString()}
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
                                Atualizar
                            </Button>
                            <Button variant="contained" color="error" onClick={handleCloseEdit}>
                                Fechar
                            </Button>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
            <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description={`${description}`}/>
        </div>
    );
}

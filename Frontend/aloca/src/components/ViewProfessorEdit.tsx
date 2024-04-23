import styles from '@/styles/viewProfessorInfo.module.css'
import TableViewProfessor from './TableViewProfessor';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Button } from '@mui/material';
import React from 'react';

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
    professor: Professor;
}

export default function ViewProfessorEdit({ professor }: propsModal) {
    const [areas, setAreas] = React.useState<Area[]>();
    const [nomeProfessor, setNomeProfessor] = React.useState(professor.nome_professor);
    const [observacoes, setObservacoes] = React.useState(professor.observacoes);
    const [area_id_area, setArea] = React.useState(professor.area_id_area);


    const handleNomeProfessorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNomeProfessor(event.target.value);
    };

    const handleObservacoesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setObservacoes(event.target.value);
    };

    const handleAreaChange = (event: SelectChangeEvent) => {
        setArea(Number(event.target.value));
    }

    const handleSubmit = async () => {

        if (!nomeProfessor || !area_id_area) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:3000/professor/${professor.id_professor}`, {
                nomeProfessor,
                observacoes,
                area_id_area,
                // Inclua aqui outros campos conforme necessário
            });

            if (response.status === 200) {
                /* alert('Cadastro realizado com sucesso!'); */
                /* onClose(); */

            } else {
                alert('Ocorreu um erro ao realizar o cadastro.');
            }
        } catch (error) {
            console.error('Erro ao realizar o cadastro:', error);
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Area[]>("http://localhost:3000/area");
                setAreas(response.data);
            } catch (e) {
                console.log(e)
            }
        }

        fetchData();
    }, []);

    /* Atualizar sempre que um professor mudar */
    React.useEffect(() => {
        setNomeProfessor(professor.nome_professor);
        setObservacoes(professor.observacoes);
        setArea(professor.area_id_area);
    }, [professor]);

    return (
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

            {areas ? (
                <FormControl sx={{
                    width: '100%',
                    margin: '10px auto 20px auto'
                }} required>
                    <InputLabel id="area-label">Área</InputLabel>
                    <Select
                        labelId="area-label"
                        id="area"
                        value={area_id_area.toString()}
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
            ) : (
                <div>Carregando áreas...</div>
            )}


            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Atualizar
            </Button>
        </Box>
    );
}
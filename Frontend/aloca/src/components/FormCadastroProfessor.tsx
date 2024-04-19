import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Button } from '@mui/material';
import axios from 'axios';

interface Area {
    id_area: number;
    nome_area: string;
}
interface FormCadastroProfessorProps {
    areas: Area[];
    onClose: () => void;
}
export default function FormCadastroProfessor({ areas, onClose }: FormCadastroProfessorProps) {
    // console.log("Dentro de FOMS: " + areas[0].nome_area);
    const [nomeProfessor, setNomeProfessor] = React.useState('');
    const [observacoes, setObservacoes] = React.useState('');
    const [area_id_area, setArea] = React.useState('');

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
                onClose();
                
            } else {
                alert('Ocorreu um erro ao realizar o cadastro.');
            }
        } catch (error) {
            console.error('Erro ao realizar o cadastro:', error);
        }
    };
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
    );
}
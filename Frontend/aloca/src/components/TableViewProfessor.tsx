import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styles from '@/styles/table.module.css'
import ModalProfessorView from './ModalProfessorView';
import axios from 'axios';
import Confirmacao from './Confirmacao';

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

interface Oferta{
    turma?: string | null;
    formandos?: string | null;
    obs_colegiados?: string | null;
    disciplina_id_disciplina: number;
    semestre_id_semestre: number;
    area_id_area: number;
    disciplina: Disciplina;
}

interface Alocacao {
    id_alocacao: number;
    oferta_id_oferta: number;
    professor_id_professor: number;
    oferta: Oferta;
    cargaHorariaTotal?: number;
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

interface propsModal{
    professores : Professor;
    carga_horaria: number | null;
}

/* 
    1° Requisiçã para trazer dados do curso e do semestre
    2° Fazer o OverFlow, pois a tabela pode crescer
*/

export default function TableViewProfessor({professores, carga_horaria} :propsModal) {
    return (
        <TableContainer>
            <Table>
                <TableHead >
                    <TableRow >
                        <TableCell className={`${styles.tableHeader}`}>Período</TableCell>
                        <TableCell className={`${styles.tableHeader}`}>Cod</TableCell>
                        <TableCell className={`${styles.tableHeader}`} >Disciplina</TableCell>
                        <TableCell className={`${styles.tableHeader}`} >Carga Horária</TableCell>
                        <TableCell className={`${styles.tableHeader}`} >Créditos</TableCell>
                        <TableCell className={`${styles.tableHeader}`} >Turma</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                        {professores && professores.alocacao.map((alocacao) =>(
                            <TableRow key={alocacao.id_alocacao} className={`${styles.tableRow}`} sx={{ fontFamily: '"Oswald", sans-serif'}}>
                                <TableCell>{alocacao.oferta.disciplina.periodo}</TableCell>
                                <TableCell>{alocacao.oferta.disciplina.cod}</TableCell>
                                <TableCell>{alocacao.oferta.disciplina.nome_disciplina}</TableCell>
                                <TableCell>{alocacao.oferta.disciplina.carga_horaria}</TableCell>
                                <TableCell>{alocacao.oferta.disciplina.qtd_creditos}</TableCell>
                                <TableCell>{alocacao.oferta.disciplina.turma}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <div className={`${styles.divCargaHoraria}`}>
                 <p className={`${styles.pCargaHoraria}`}>Carga Horária: <span className={`${styles.spanCargaHoraria}`}>{carga_horaria}h</span></p>
            </div>
            
        </TableContainer>
    );
}
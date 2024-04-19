import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface Professor {
    id_professor: number;
    nome_professor: string;
    observacoes: string;
}

interface propsTable{
    professores: Professor[];
}
export default function TableProfessor({professores}: propsTable) {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell >Observações</TableCell>
                        <TableCell >Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {professores && professores.map((professor) =>(
                        <TableRow key={professor.id_professor}>
                            <TableCell>{professor.nome_professor}</TableCell>
                            <TableCell>{professor.observacoes}</TableCell>
                            <TableCell>Em construção</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
}
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

interface Professor {
    id_professor: number;
    nome_professor: string;
    observacoes: string;
}

interface propsTable{
    professores: Professor[];
}
export default function TableProfessor({professores}: propsTable) {
    const [open, setOpen] = React.useState(false);
    const [acao, setAcao] = React.useState(Number);
    const [id_professor, setIdProfessor] = React.useState(Number);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [professoresList, setProfessoresList] = React.useState<Professor[]>(professores); 
    /* Para a confimação */
    const [openConfirmation, setOpenConfirmation] = React.useState(false);

    const handleClick = (id_professor: number, acao:number) =>{
        //console.log(`Id do professor clicado: ${id_professor} | Acao: ${acao}`)
        if(acao === 3){
            deleteProfessor(+id_professor)
        }else{
            setAcao(acao);
            setIdProfessor(+id_professor);
            handleOpen();
        }
       
    }

    const deleteProfessor = async (idProfessor: number) =>{
        try {
            const response = await axios.delete(`http://localhost:3000/professor/${idProfessor}`);
            if(response.status === 200){
                setOpenConfirmation(true);
                location.reload();  
                
            }
        } catch (error) {
            alert('Ocorreu um erro ao realizar o cadastro.');
        }
    }

    return (
        <TableContainer>
            <Table>
                <TableHead >
                    <TableRow >
                        <TableCell className={`${styles.tableHeader}`}>Professor</TableCell>
                        <TableCell className={`${styles.tableHeader}`}>Observações</TableCell>
                        <TableCell className={`${styles.tableHeader}`} >Ações</TableCell>
                    </TableRow> 
                </TableHead>
                <TableBody>
                    {professores && professores.map((professor) =>(
                        <TableRow key={professor.id_professor} className={`${styles.tableRow}`}>
                            <TableCell>{professor.nome_professor}</TableCell>
                            <TableCell>{professor.observacoes}</TableCell>
                            <TableCell>
                                <div className={`${styles.containerAcoes}`}>
                                    <i onClick={() => handleClick(professor.id_professor, 1)}  className={`fa-solid fa-eye ${styles.iconAcoes} ${styles.iconsAcoesGeral} ${styles.iconsEye}`}></i>
                                    <i onClick={() => handleClick(professor.id_professor, 2)} className={`fa-solid fa-pen ${styles.iconAcoes} ${styles.iconsAcoesGeral} ${styles.iconsPen}`}></i>
                                    <i onClick={() => handleClick(professor.id_professor, 3)} className={`fa-solid fa-trash ${styles.iconsAcoesGeral} ${styles.iconsTrash}`}></i>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ModalProfessorView open={open} handleClose={handleClose} acao={acao} id_professor={id_professor}/>
            <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description='Professor Deletado com Sucesso!'/>
        </TableContainer>

    );
}
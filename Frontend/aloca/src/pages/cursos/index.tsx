import * as React from 'react';
import Header from "@/components/Header";
import styleTable from "@/styles/table.module.css"
import style from "@/styles/gestaoCurso.module.css"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import Confirmacao from '@/components/Confirmacao';
import ModalCursoEdit from '@/components/ModalCursoEdit';
import ModalCursoCreate from '@/components/ModalCursoCreate';

interface Curso {
    nome_curso: string;
    tipo_curso: string;
}

export default function Index() {
    const [cursos, setCursos] = React.useState<any[]>();
    const [curso, setCurso] = React.useState<Curso | null>(null);
    const [description, setDescription] = React.useState("");
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const [openModalEdit, setOpenModalEdit] = React.useState(false);
    const [id_curso, setIdCurso] = React.useState(Number);
    /* Funções */
    const handleOpenEdit = () => setOpenModalEdit(true);
    const handleCloseEdit = () => setOpenModalEdit(false);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Curso[]>("http://localhost:3000/curso");
                setCursos(response.data);
            } catch (e) {
                console.log(e)
            }
        }

        fetchData();
    }, [cursos]);

    const handleClick = async (id_curso: number, acao:number) =>{
        if(acao === 3){
            deleteCurso(+id_curso)
        }
        
        if(acao === 2){
            setIdCurso(+id_curso);
            handleOpenEdit(); 
            try {
                const response = await axios.get(`http://localhost:3000/curso/${id_curso}`);
                setCurso(response.data);  
            } catch (error) {
                console.log(error);
            }
            
        }
        /*
        if(acao === 1){
            setAcao(acao);
            setIdProfessor(+id_professor);
            handleOpen();
        } */
       
    }

    const deleteCurso = async (idCurso: number) =>{
        try {
            const response = await axios.delete(`http://localhost:3000/curso/${idCurso}`);
            if(response.status === 200){
                setDescription("Curso deletado com sucesso!");
                setOpenConfirmation(true);  
            }
        } catch (error) {
            alert('Ocorreu um erro ao realizar o cadastro.');
        }
    }

    return (
        <div>
            <Header title="Gestão Cursos" />
            <main>
                <h2 className={`${style.titlePage}`}>Gestão de Cursos</h2>

                <TableContainer className={`${style.tableContainer}`}>
                    <Table>
                        <TableHead >
                            <TableRow >
                                <TableCell className={`${styleTable.tableHeader}`}>Curso</TableCell>
                                <TableCell className={`${styleTable.tableHeader}`}>Tipo</TableCell>
                                <TableCell className={`${styleTable.tableHeader}`}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cursos && cursos.map((curso) => (
                                <TableRow key={curso.id_curso} className={`${styleTable.tableRow}`} sx={{ fontFamily: '"Oswald", sans-serif' }}>
                                    <TableCell>{curso.nome_curso}</TableCell>
                                    <TableCell>{curso.tipo_curso}</TableCell>
                                    <TableCell>
                                        <div className={`${styleTable.containerAcoes}`}>
                                           {/*  <i onClick={() => handleClick(curso.id_curso, 1)} className={`fa-solid fa-eye ${styleTable.iconAcoes} ${styleTable.iconsAcoesGeral} ${styleTable.iconsEye}`}></i> */}
                                            <i onClick={() => handleClick(curso.id_curso, 2)} className={`fa-solid fa-pen ${styleTable.iconAcoes} ${styleTable.iconsAcoesGeral} ${styleTable.iconsPen}`}></i>
                                            <i onClick={() => handleClick(curso.id_curso, 3)} className={`fa-solid fa-trash ${styleTable.iconsAcoesGeral} ${styleTable.iconsTrash}`}></i>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description={description}/>
                    {curso ? <ModalCursoEdit openModalEdit={openModalEdit} handleCloseEdit={handleCloseEdit} id_curso={id_curso} curso={curso}/> : null}
                </TableContainer>
                <ModalCursoCreate/>
            </main>
        </div>

    );
}
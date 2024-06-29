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
import ModalSemestreCreate from '@/components/ModalSemestreCreate';
import ModalSemestreEdit from '@/components/ModalSemestreEdit';

interface Semestre {
    nome_semestre: string;
}

export default function Index() {
    const [semestres, setSemestres] = React.useState<any[]>();
    const [semestre, setSemestre] = React.useState<Semestre | null>(null);
    const [description, setDescription] = React.useState("");
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const [openModalEdit, setOpenModalEdit] = React.useState(false);
    const [id_semestre, setIdSemestre] = React.useState(Number);
    const handleOpenEdit = () => setOpenModalEdit(true);
    const handleCloseEdit = () => setOpenModalEdit(false);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Semestre[]>("http://localhost:3000/semestre");
                setSemestres(response.data);
            } catch (e) {
                console.log(e)
            }
        }

        fetchData();
    }, [semestres]);

    const handleClick = async (id_semestre: number, acao:number) =>{

        if(acao === 3){
            deleteCurso(+id_semestre)
        }
        
        if(acao === 2){
            setIdSemestre(+id_semestre);
            handleOpenEdit(); 
            try {
                const response = await axios.get(`http://localhost:3000/semestre/${id_semestre}`);
                setSemestre(response.data);  
            } catch (error) {
                console.log(error);
            }
            
        }
    }

    const deleteCurso = async (idSemestre: number) =>{
        try {
            const response = await axios.delete(`http://localhost:3000/semestre/${idSemestre}`);
            if(response.status === 200){
                setDescription("Semestre deletado com sucesso!");
                setOpenConfirmation(true);  
            }
        } catch (error) {
            alert('Ocorreu um erro ao tentar exluir um semestre');
        }
    }


    return(
        <div>
            <Header title="Gestão Semestres" />
            <main>
                <h2 className={`${style.titlePage}`}>Gestão de Semestres</h2>

                <TableContainer className={`${style.tableContainer}`}>
                    <Table>
                        <TableHead >
                            <TableRow >
                                <TableCell className={`${styleTable.tableHeader}`}>Semestre</TableCell>
                                <TableCell className={`${styleTable.tableHeader}`}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {semestres && semestres.map((semestre) => (
                                <TableRow key={semestre.id_semestre} className={`${styleTable.tableRow}`} sx={{ fontFamily: '"Oswald", sans-serif' }}>
                                    <TableCell sx={{ fontFamily: '"Oswald", sans-serif' }}>{semestre.nome_semestre}</TableCell>
                                    <TableCell >
                                        <div className={`${styleTable.containerAcoes}`}>
                                           {/*  <i onClick={() => handleClick(curso.id_curso, 1)} className={`fa-solid fa-eye ${styleTable.iconAcoes} ${styleTable.iconsAcoesGeral} ${styleTable.iconsEye}`}></i> */}
                                            <i onClick={() => handleClick(semestre.id_semestre, 2)} className={`fa-solid fa-pen ${styleTable.iconAcoes} ${styleTable.iconsAcoesGeral} ${styleTable.iconsPen}`}></i>
                                            <i onClick={() => handleClick(semestre.id_semestre, 3)} className={`fa-solid fa-trash ${styleTable.iconsAcoesGeral} ${styleTable.iconsTrash}`}></i>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description={description}/>
                    {semestre ? <ModalSemestreEdit openModalEdit={openModalEdit} handleCloseEdit={handleCloseEdit} id_semestre={id_semestre} semestre={semestre}/> : null}
                </TableContainer>
                <ModalSemestreCreate/>
            </main>
        </div>

    );
}
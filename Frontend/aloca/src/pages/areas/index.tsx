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
import ModalAreaCreate from '@/components/ModalAreaCreate';
import ModalAreaEdit from '@/components/ModalAreaEdit';

interface Area {
    nome_area: string;
}

export default function Index() {
    const [areas, setAreas] = React.useState<any[]>();
    const [area, setArea] = React.useState<Area | null>(null);
    const [description, setDescription] = React.useState("");
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const [openModalEdit, setOpenModalEdit] = React.useState(false);
    const [id_area, setIdArea] = React.useState(Number);
    const handleOpenEdit = () => setOpenModalEdit(true);
    const handleCloseEdit = () => setOpenModalEdit(false);

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
    }, [areas]);

    const handleClick = async (id_area: number, acao:number) =>{

        if(acao === 3){
            deleteCurso(+id_area)
        }
        
        if(acao === 2){
            setIdArea(+id_area);
            handleOpenEdit(); 
            try {
                const response = await axios.get(`http://localhost:3000/area/${id_area}`);
                setArea(response.data);  
            } catch (error) {
                console.log(error);
            }
            
        }
    }

    const deleteCurso = async (idArea: number) =>{
        try {
            const response = await axios.delete(`http://localhost:3000/area/${idArea}`);
            if(response.status === 200){
                setDescription("Área deletada com sucesso!");
                setOpenConfirmation(true);  
            }
        } catch (error) {
            alert('Ocorreu um erro ao realizar o cadastro.');
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
                            {areas && areas.map((area) => (
                                <TableRow key={area.id_area} className={`${styleTable.tableRow}`} sx={{ fontFamily: '"Oswald", sans-serif' }}>
                                    <TableCell >{area.nome_area}</TableCell>
                                    <TableCell >
                                        <div className={`${styleTable.containerAcoes}`}>
                                           {/*  <i onClick={() => handleClick(curso.id_curso, 1)} className={`fa-solid fa-eye ${styleTable.iconAcoes} ${styleTable.iconsAcoesGeral} ${styleTable.iconsEye}`}></i> */}
                                            <i onClick={() => handleClick(area.id_area, 2)} className={`fa-solid fa-pen ${styleTable.iconAcoes} ${styleTable.iconsAcoesGeral} ${styleTable.iconsPen}`}></i>
                                            <i onClick={() => handleClick(area.id_area, 3)} className={`fa-solid fa-trash ${styleTable.iconsAcoesGeral} ${styleTable.iconsTrash}`}></i>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description={description}/>
                    {area ? <ModalAreaEdit openModalEdit={openModalEdit} handleCloseEdit={handleCloseEdit} id_area={id_area} area={area}/> : null}
                </TableContainer>
                <ModalAreaCreate/>
            </main>
        </div>

    );
}
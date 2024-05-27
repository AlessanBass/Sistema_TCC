import Header from "@/components/Header";
import axios from "axios";
import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import styles from '@/styles/table.module.css';
import style from '@/styles/dropzone.module.css'
import disciplinaStyles from '@/styles/disciplinas.module.css';
import ModalDisciplinaCreate from "@/components/ModalDisciplinaCreate";
import Confirmacao from "@/components/Confirmacao";
import ModalDisciplinaEdit from "@/components/ModalDisciplinaEdit";

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

interface Area {
    id_area: number;
    nome_area: string;
}

export default function Index() {
    const [disciplinas, setDisciplinas] = React.useState<Disciplina[] | null>(null);
    const [disciplinaModalEdita, setDisciplinaEdit] = React.useState<Disciplina | null>(null); // Ajustado aqui
    const [areas, setAreas] = React.useState<Area[]>();
    const [description, setDescription] = React.useState("");
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const [openModalEdit, setOpenModalEdit] = React.useState(false);
    const [id_disciplina, setIdDisicplina] = React.useState(Number);
    const [selectedArea, setSelectedArea] = React.useState<number | undefined>();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalDisciplinas, setTotalDisciplinas] = React.useState(0);
    const handleOpenEdit = () => setOpenModalEdit(true);
    const handleCloseEdit = () => setOpenModalEdit(false);

    React.useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response_areas = await axios.get("http://localhost:3000/area");
                setAreas(response_areas.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAreas();
    }, []);

    React.useEffect(() => {
        const fetchDisciplinas = async () => {
            if (selectedArea !== undefined) {
                try {
                    const response = await axios.get(`http://localhost:3000/disciplina/curso/${selectedArea}`, {
                        params: {
                            skip: page * rowsPerPage,
                            take: rowsPerPage
                        }
                    });
                    setDisciplinas(response.data.disciplinas.length ? response.data.disciplinas : null);
                    setTotalDisciplinas(response.data.total);
                } catch (error) {
                    /* console.log(error); */
                    setDisciplinas(null);
                }
            }
        };
        fetchDisciplinas();
    }, [selectedArea, page, rowsPerPage, disciplinas]);

    const handleClick = async (id_disciplina: number, acao:number) =>{
        if(acao === 3){
            deleteDisciplina(+id_disciplina)
        }
        
        if(acao === 2){
            setIdDisicplina(+id_disciplina);
            handleOpenEdit(); 
            try {
                const response = await axios.get(`http://localhost:3000/disciplina/${id_disciplina}`);
                setDisciplinaEdit(response.data);  
            } catch (error) {
                alert('Ocorreu um erro eo tentar abrir o modal de editar disciplina');
            }
            
        }
    }

    const deleteDisciplina = async (id_disciplina: number) =>{
        try {
            const response = await axios.delete(`http://localhost:3000/disciplina/${id_disciplina}`);
            if(response.status === 200){
                setDescription("Disciplina deletada com sucesso!");
                setOpenConfirmation(true);  
            }
        } catch (error) {
            alert('Ocorreu um erro ao deletar a disciplina');
        }
    }

    const handleAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArea(Number(event.target.value));
        setDisciplinas(null); // Reset disciplines when area changes
        setPage(0); // Reset page when area changes
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className={`${disciplinaStyles.main}`}>
            <Header title="Gestão de Disciplinas" />
            <h2 className={`${style.titlePage}`}>Filtar Disciplinas por curso</h2>
            <ModalDisciplinaCreate/>
            <form className={`${disciplinaStyles.form}`}>
                <select name="area" id="area" onChange={handleAreaChange} className={`${disciplinaStyles.Select}`}>
                    <option value="">Selecione uma área</option>
                    {areas?.map((area: Area) => (
                        <option key={area.id_area} value={area.id_area}>
                            {area.nome_area}
                        </option>
                    ))}
                </select>
            </form>
            {selectedArea === undefined ? (
                <p className={`${disciplinaStyles.p}`}>Selecione uma área para ver as disciplinas.</p>
            ) : disciplinas === null ? (
                <p className={`${disciplinaStyles.p}`}>O curso selecionado não possui nenhuma disciplina cadastrada.</p>
            ) : (
                <div className={`${disciplinaStyles.divTable}`}>
                    <TableContainer className={`${disciplinaStyles.tabelContainner}`}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={`${styles.tableHeader}`}>CÓD</TableCell>
                                    <TableCell className={`${styles.tableHeader}`}>DISCIPLINA</TableCell>
                                    <TableCell className={`${styles.tableHeader}`}>CH</TableCell>
                                    <TableCell className={`${styles.tableHeader}`}>CHs</TableCell>
                                    <TableCell className={`${styles.tableHeader}`}>AÇÕES</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {disciplinas.map((disciplina) => (
                                    <TableRow key={disciplina.id_disciplina} className={`${styles.tableRow}`}>
                                        <TableCell sx={{ fontFamily: '"Oswald", sans-serif', fontSize: '1em' }}>{disciplina.cod}</TableCell>
                                        <TableCell sx={{ fontFamily: '"Oswald", sans-serif', fontSize: '1em' }}>{disciplina.nome_disciplina}</TableCell>
                                        <TableCell sx={{ fontFamily: '"Oswald", sans-serif', fontSize: '1em' }}>{disciplina.carga_horaria}</TableCell>
                                        <TableCell sx={{ fontFamily: '"Oswald", sans-serif', fontSize: '1em' }}>{disciplina.qtd_creditos}</TableCell>
                                        <TableCell>
                                            <div className={`${styles.containerAcoes}`}>
                                                <i onClick={() => handleClick(disciplina.id_disciplina, 2)} className={`fa-solid fa-pen ${styles.iconAcoes} ${styles.iconsAcoesGeral} ${styles.iconsPen}`}></i>
                                                <i onClick={() => handleClick(disciplina.id_disciplina, 3)} className={`fa-solid fa-trash ${styles.iconsAcoesGeral} ${styles.iconsTrash}`}></i>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                            <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description={description}/>
                            {disciplinaModalEdita ? <ModalDisciplinaEdit openModalEdit={openModalEdit} handleCloseEdit={handleCloseEdit} id_disciplina={id_disciplina} disciplina={disciplinaModalEdita}/> : null}
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={totalDisciplinas}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        className={`${disciplinaStyles.tablePagination}`}
                        rowsPerPageOptions={[5,8,10]}
                    />
                </div>
            )}
        </div>
    );
}

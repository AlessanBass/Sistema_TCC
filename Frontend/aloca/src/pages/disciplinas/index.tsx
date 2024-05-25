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
    const [areas, setAreas] = React.useState<Area[]>();
    const [selectedArea, setSelectedArea] = React.useState<number | undefined>();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalDisciplinas, setTotalDisciplinas] = React.useState(0);

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
                    console.log(error);
                    setDisciplinas(null);
                }
            }
        };
        fetchDisciplinas();
    }, [selectedArea, page, rowsPerPage]);

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
        <div>
            <Header title="Gestão de Disciplinas" />
            <form>
                <select name="area" id="area" onChange={handleAreaChange}>
                    <option value="">Selecione uma área</option>
                    {areas?.map((area: Area) => (
                        <option key={area.id_area} value={area.id_area}>
                            {area.nome_area}
                        </option>
                    ))}
                </select>
            </form>
            {selectedArea === undefined ? (
                <p>Selecione uma área para ver as disciplinas.</p>
            ) : disciplinas === null ? (
                <p>O curso selecionado não possui nenhuma disciplina cadastrada.</p>
            ) : (
                <>
                    <TableContainer>
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
                                                <i className={`fa-solid fa-eye ${styles.iconAcoes} ${styles.iconsAcoesGeral} ${styles.iconsEye}`}></i>
                                                <i className={`fa-solid fa-pen ${styles.iconAcoes} ${styles.iconsAcoesGeral} ${styles.iconsPen}`}></i>
                                                <i className={`fa-solid fa-trash ${styles.iconsAcoesGeral} ${styles.iconsTrash}`}></i>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={totalDisciplinas}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
        </div>
    );
}

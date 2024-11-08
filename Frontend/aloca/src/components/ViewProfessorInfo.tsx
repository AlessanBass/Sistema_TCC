import styles from '@/styles/viewProfessorInfo.module.css'
import TableViewProfessor from './TableViewProfessor';
import styleGenerate from '@/styles/generateExcel.module.css';
import React, { useState } from 'react';
import axios from 'axios';
interface Semestre {
    id_semestre: number;
    nome_semestre: string;
}

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

interface Oferta {
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

export default function ViewProfessorInfo({ professor }: propsModal) {
    const [semestres, setSemestres] = useState<Semestre[] | undefined>(undefined);
    const [selectedSemestre, setSelectedSemestre] = useState<number | undefined>();
    const [alocacaoAtualizada, setAlocacaoAtualizada] = useState(professor.alocacao || []); // Inicializando como array vazio
    const [horasSemana, setHorasSemana] = useState<number | null>(null);  // Para armazenar o valor de horasSemana




    const handleSemestreChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const semestreId = Number(event.target.value);
        setSelectedSemestre(semestreId);

        if (semestreId) {
            try {
                // Faz a requisição para buscar as disciplinas do professor para o semestre selecionado
                const response = await axios.get(`http://localhost:3000/professor/name/${professor.id_professor}/${semestreId}`);
                // Atualiza a alocação com os dados retornados
                setAlocacaoAtualizada(response.data.professor.alocacao || []); // Certifica-se que seja um array vazio se não houver alocação
                setHorasSemana(response.data.horasSemana);
                console.log(horasSemana);

            } catch (error) {
                console.error("Erro ao buscar disciplinas:", error);
            }
        }
    };

    // const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     setSemestre(Number(event.target.value));
    // };

    React.useEffect(() => {
        const fetchSemestreLatest = async () => {
            try {
                const response = await axios.get<Semestre[]>(`http://localhost:3000/semestre`);
                setSemestres(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchSemestreLatest();
    }, []);



    return (
        <>
            <div className={`${styles.containerInfoProfessor}`}>
                <h2 className={`${styles.infoGerais}`}>Informações Gerais</h2>
                <p className={`${styles.pInfo}`}>Professor(a): <span className={`${styles.span}`}>{professor.nome_professor}</span> </p>
                <p className={`${styles.pInfo}`}>Observações: <span className={`${styles.span}`}>{professor.observacoes}</span> </p>
                <p className={`${styles.pInfo}`}>Área: <span className={`${styles.span}`}>{professor.area.nome_area}</span> </p>

                <h2 className={`${styles.infoGerais} ${styles.h2Diciplina}`}>Disciplinas Ministradas</h2>
                

                <div  className={styles.divSelectSemestre}>
                    <select name="selecaSemestre" id="selecaoSemestre" onChange={handleSemestreChange} className={styles.selectInProfessores}>
                        <option value="0" className={styleGenerate.option}>Selecione um semestre</option>
                        {semestres?.map((semestre: Semestre) => (
                            <option key={semestre.id_semestre} value={semestre.id_semestre} className={styleGenerate.option}>
                                {semestre.nome_semestre}
                            </option>
                        ))}
                    </select>
                </div>

                

                {/* Tabela de disciplinas ministradas com base no semestre selecionado */}
                {selectedSemestre && selectedSemestre !== 0 && alocacaoAtualizada && alocacaoAtualizada.length > 0 ? (
                    <TableViewProfessor professores={{ ...professor, alocacao: alocacaoAtualizada }} carga_horaria={horasSemana} />
                ) : (
                    <p className={`${styles.pInfo} ${styles.infoSemDisciplina}`}>
                        Professor(a) ainda não assumiu nenhuma disciplina neste semestre
                    </p>
                )}
            </div>
        </>
    );
}
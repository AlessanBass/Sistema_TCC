import styles from '@/styles/viewProfessorInfo.module.css'
import TableViewProfessor from './TableViewProfessor';

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

interface Alocacao {
    id_alocacao: number;
    observacoes_colegiado: string | null;
    disciplina_id_disciplina: number;
    professor_id_professor: number;
    semestre_id_semestre: number;
    disciplina: Disciplina;
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
    professor : Professor;
}

export default function ViewProfessorInfo({professor}: propsModal){
    return(
        <>
        <div className={`${styles.containerInfoProfessor}`}>
            <h2 className={`${styles.infoGerais}`}>Informações Gerais</h2>
            <p className={`${styles.pInfo}`}>Professor(a): <span className={`${styles.span}`}>{professor.nome_professor}</span> </p>
            <p className={`${styles.pInfo}`}>Observações: <span className={`${styles.span}`}>{professor.observacoes}</span> </p>
            <p className={`${styles.pInfo}`}>Área: <span className={`${styles.span}`}>{professor.area.nome_area}</span> </p>

            <h2 className={`${styles.infoGerais} ${styles.h2Diciplina}`}>Disciplinas Ministradas</h2>
            { professor.alocacao.length > 0 ? <TableViewProfessor professores={professor}/> : <p className={`${styles.pInfo} ${styles.infoSemDisciplina}`}>Professor(a) ainda não assumiu nenhuma disciplina</p>}
        </div>
        </>
    );
}
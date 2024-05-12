import Card from "./CardMenu";
import styles from "@/styles/main.module.css"

export default function Main(){
    return(
        <div>
            <h1 className={styles.h1}>Menu de Opções</h1>
            <main className={`${styles.main}`}>
                <Card link="http://localhost:3001/upload_oferta" icon="fa-solid fa-upload" title="Oferta de Disciplinas" description="Enviar o arquivo com as disciplinas ofertadas"/>
                <Card link="http://localhost:3001/professores" icon="fa-solid fa-chalkboard-user" title="Gestão de Professores" description="Visualizar, Editar, Inserir e Deletar"/>
                <Card link="http://localhost:3001/cursos" icon="fa-solid fa-person-chalkboard" title="Gestão de Cursos" description="Visualizar, Editar, Inserir e Deletar"/>
                <Card link="http://localhost:3001/semestres" icon="fa-regular fa-calendar-days" title="Gestão de Semestres" description="Visualizar, Editar, Inserir e Deletar"/>
                <Card link="teste" icon="fa-solid fa-user" title="Gestão de Disciplinas" description="Visualizar, Editar, Inserir e Deletar"/>
                <Card link="http://localhost:3001/areas" icon="fa-solid fa-globe" title="Gestão de Áreas" description="Visualizar, Editar, Inserir e Deletar"/>
            </main>
        </div>
    );
}
import Card from "./CardMenu";
import styles from "@/styles/main.module.css"

export default function Main(){
    return(
        <div>
            <h1 className={styles.h1}>Menu de Opções</h1>
            <main className={`${styles.main}`}>
                <Card link="teste" icon="fa-solid fa-chalkboard-user" title="Gestão de Professores" description="Visualizar, Editar, Inserir e Deletar"/>
                <Card link="teste2" icon="fa-solid fa-user" title="Gestão de Disciplinas" description="Visualizar, Editar, Inserir e Deletar"/>
            </main>
        </div>
    );
}
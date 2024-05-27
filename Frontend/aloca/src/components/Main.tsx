import Card from "./CardMenu";
import styles from "@/styles/main.module.css"

export default function Main(){
    return(
        <div>
            <h1 className={styles.h1}>Menu de Opções</h1>
            <main className={`${styles.main}`}>
                <Card link="http://localhost:3001/upload_oferta" icon="fa-solid fa-upload" title="Oferta de Disciplinas" description="Enviar o arquivo com as disciplinas ofertadas"/>
                <Card link="http://localhost:3001/upload_indicacao" icon="fa-solid fa-upload" title="Indicação de Docentes" description="Enviar o arquivo com a indicação de docentes"/>
                <Card link="http://localhost:3001/gerar_planilhas" icon="fa-solid fa-download" title="Gerar Planilhas" description="Gerar planilhas de oferta ou indicação"/>
                <Card link="http://localhost:3001/professores" icon="fa-solid fa-chalkboard-user" title="Gestão de Professores" description="Visualizar, Editar, Inserir e Deletar"/>
                <Card link="http://localhost:3001/disciplinas" icon="fa-solid fa-user" title="Gestão de Disciplinas" description="Visualizar, Editar, Inserir e Deletar"/>
                <Card link="http://localhost:3001/cursos" icon="fa-solid fa-person-chalkboard" title="Gestão de Cursos" description="Visualizar, Editar, Inserir e Deletar"/>
                <Card link="http://localhost:3001/semestres" icon="fa-regular fa-calendar-days" title="Gestão de Semestres" description="Visualizar, Editar, Inserir e Deletar"/>
                <Card link="http://localhost:3001/areas" icon="fa-solid fa-globe" title="Gestão de Áreas" description="Visualizar, Editar, Inserir e Deletar"/>
            </main>
            {/* <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.507267176079!2d-39.17595732572343!3d-14.796761599180662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x739a9cffe548e19%3A0xe91ca23dc7294b8!2sUniversidade%20Estadual%20de%20Santa%20Cruz%20%E2%80%93%20UESC!5e0!3m2!1spt-BR!2sbr!4v1716830823877!5m2!1spt-BR!2sbr"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe> */}
        </div>
    );
}
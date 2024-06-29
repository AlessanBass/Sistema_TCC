import Card from "./CardMenu";
import Image from 'next/image';
import myGif from '../../public/logo_gif.gif'
import styles from "@/styles/main.module.css"
import Footer from "./Footer";

export default function Main() {
    return (
        <div>
            <h1 className={styles.h1}>Menu de Opções</h1>
            <main >
                <div className={`${styles.main}`}>
                    <Card link="http://localhost:3001/upload_oferta" icon="fa-solid fa-upload" title="Oferta de Disciplinas" description="Enviar o arquivo com as disciplinas ofertadas" />
                    <Card link="http://localhost:3001/gerar_planilhas" icon="fa-solid fa-download" title="Gerar Planilhas" description="Gerar planilhas de oferta ou indicação" />
                    <Card link="http://localhost:3001/upload_indicacao" icon="fa-solid fa-upload" title="Indicação de Docentes" description="Enviar o arquivo com a indicação de docentes" />
                    <Card link="http://localhost:3001/professores" icon="fa-solid fa-chalkboard-user" title="Gestão de Professores" description="Visualizar, Editar, Inserir e Deletar" />
                    <Card link="http://localhost:3001/disciplinas" icon="fa-solid fa-user" title="Gestão de Disciplinas" description="Visualizar, Editar, Inserir e Deletar" />
                    <Card link="http://localhost:3001/cursos" icon="fa-solid fa-person-chalkboard" title="Gestão de Cursos" description="Visualizar, Editar, Inserir e Deletar" />
                    <Card link="http://localhost:3001/semestres" icon="fa-regular fa-calendar-days" title="Gestão de Semestres" description="Visualizar, Editar, Inserir e Deletar" />
                    <Card link="http://localhost:3001/areas" icon="fa-solid fa-globe" title="Gestão de Áreas" description="Visualizar, Editar, Inserir e Deletar" />
                </div>

                <div className={`${styles.sobreNos}`}>
                    <h3 className={`${styles.h3}`}>SOBRE A FERRAMENTA</h3>

                    <div className={`${styles.containerImageParagrafo}`}>
                        <div>
                            <Image className={`${styles.gif}`} src={myGif} alt="Gif Aloca Macth"></Image>
                        </div>

                        <div className={`${styles.containerTextos}`}>

                            <h3 className={`${styles.h2Title}`}>Aloca + Match: Ferramenta de Alocação de Disciplinas</h3>

                            <p className={`${styles.paragrafoSobreNos}`}>Aloca + Match é a solução inovadora projetada para simplificar e
                                otimizar o processo de alocação de disciplinas na UESC. Desenvolvido
                                para atender às demandas específicas do ambiente acadêmico, nosso
                                sistema elimina a complexidade e o potencial de erro associados à
                                alocação manual de disciplinas para professores.
                            </p>

                            <p className={`${styles.paragrafoSobreNos}`}>Não apenas simplificamos o processo, mas também aumentamos a eficiência,
                                permitindo que os gestores acadêmicos foquem em atividades mais estratégicas.
                                Com Aloca + Match, garantimos que cada professor seja alocado nas disciplinas de forma mais eficiente,
                                promovendo um ambiente acadêmico mais organizado e produtivo.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`${styles.uesc}`}>
                    <h3 className={`${styles.h3}`}>CONHEÇA A UESC</h3>

                    <div className={`${styles.containerImageParagrafo}`}>
                        <p className={`${styles.paragrafoSobreNos}`}>
                            A Universidade Estadual de Santa Cruz é uma instituição de
                            ensino superior brasileira, situada em Ilhéus, Estado da Bahia, no km 16 da
                            Rodovia BR-415. Foi criada pela fusão e estadualização de um conjunto de
                            faculdades privadas surgidas no sul da Bahia na década de 1960.
                        </p>

                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.507267176079!2d-39.17595732572343!3d-14.796761599180662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x739a9cffe548e19%3A0xe91ca23dc7294b8!2sUniversidade%20Estadual%20de%20Santa%20Cruz%20%E2%80%93%20UESC!5e0!3m2!1spt-BR!2sbr!4v1716830823877!5m2!1spt-BR!2sbr"
                           /*  width="2000"
                            height="400" */
                            style={{ border: 0, width: '100%', height: '400px', padding:'20px' }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>


                </div>

                <Footer/>
            </main>
        </div>
    );
}
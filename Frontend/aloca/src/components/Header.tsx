import Head from "next/head";
import styles from "@/styles/header.module.css";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
    title: string; // Defina o tipo de todas as props conforme necessário
}

export default function Header(props : HeaderProps){
    return(
        <div className={`${styles.header}`}>
            <Head> 
                <title>{props.title}</title>
            </Head>
            <header className={`${styles.headerNav}`}>
                <Link href={"/"}>
                    <Image
                        alt="Logo Aplicação"
                        src="/logo.png"
                        width={200}
                        height={200}
                        className={`${styles.logoHeader}`}
                    />
                </Link>

                <Link href={"https://www.youtube.com/playlist?list=PLaSARLycBs8XNLf2K450mjPWBX0zoEIZp"} target="_blank" className={`${styles.divTutorial}`}>
                    <i className={`fa-brands fa-youtube ${styles.icondivTutorial}`}></i>
                    <p className={`${styles.pdivTutorial}`}>Assistir Tutoriais</p>
                </Link>
            </header>
        </div>
    );
}
import Image from 'next/image';
import styleFooter from '@/styles/footer.module.css'
import myGif from '../../public/logo_gif.gif'
import brasao from '../../public/brasao_uesc.png'

export default function Footer(){
    return(
        <div className={`${styleFooter.divFooter}`}>
            <div className={`${styleFooter.containerLogoGif}`}>
                <Image className={`${styleFooter.gif}`} src={myGif} alt="Gif Aloca Macth"></Image>
                <p className={`${styleFooter.pFooter}`}>Sistema de Suporte ao Processo de Alocação de Disciplinas</p>
            </div>

            <div className={`${styleFooter.containerInfoUesc}`}>
                <Image className={`${styleFooter.brasao}`} src={brasao} alt="Brasão UESC"></Image>
                <p>Universidade Estadual de Santa Cruz - UESC</p>
                <p className={`${styleFooter.pInfoUesc}`}>Campus Soane Nazaré de Andrade, Rodovia Jorge Amado, Km 16, Bairro Salobrinho</p>
                <p className={`${styleFooter.pInfoUesc}`}>CEP 45662-900. Ilhéus-Bahia</p>
            </div>

            <hr className={`${styleFooter.hr}`}/>
            <span className={`${styleFooter.spanFooter}`}>Desenvolvido por : Alessandro Conceição Santos</span>
        </div>
    );
}
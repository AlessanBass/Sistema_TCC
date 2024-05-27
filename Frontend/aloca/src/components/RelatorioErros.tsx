import styleRetorio from '@/styles/relatorioErros.module.css'

interface Erro {
    linha: number ;
    mensagem: string ;
    valor_celula: string | number | null | undefined ;
    tipo_esperado: string ;
    detalhe: string | null;
}

interface propsRelatorio{
    erros: Erro[];
}
export default function RelatorioErros({erros} :propsRelatorio){
    return (
        <div className={`${styleRetorio.containnerRelatorio}`}>
            <h3 className={`${styleRetorio.h3}`}>RELATÓRIO DO UPLOAD</h3>
            {erros.map((erro) =>(
                <div className={`${styleRetorio.listErros}`}>
                    <p> 
                        <span className={`${styleRetorio.headErro}`}>Linha:</span> 
                        <span className={`${styleRetorio.detailErro}`}>{erro.linha}</span> 
                    </p>

                    <p> 
                        <span className={`${styleRetorio.headErro}`}>Mensagem:</span>
                        <span className={`${styleRetorio.detailErro}`}>{erro.mensagem}</span> 
                    </p>

                    <p> 
                        <span className={`${styleRetorio.headErro}`}>Detalhe:</span>
                        <span className={`${styleRetorio.detailErro}`}>{erro.detalhe}</span> 
                    </p>
                </div>
            ))}
            
        </div>
    );
}
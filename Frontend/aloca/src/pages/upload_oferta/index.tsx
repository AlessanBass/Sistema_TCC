import React from 'react';
import { useDropzone } from 'react-dropzone';
import Header from "@/components/Header";
import { Button } from '@mui/material';
import style from '@/styles/dropzone.module.css'
import axios from "axios";
import RelatorioErros from '@/components/RelatorioErros';

interface Erro {
    linha: number ;
    mensagem: string ;
    valor_celula: string | number | null | undefined ;
    tipo_esperado: string ;
    detalhe: string | null;
}

export default function Index() {
    const [file, setFile] = React.useState<File | null>(null);
    const [fileSelected, setFileSelected] = React.useState(false);
    const [erros, setErros] = React.useState<Erro []>([]);

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length) {
            setFile(acceptedFiles[0]);
            setFileSelected(true);
        }
    }, []);

    const { getRootProps, getInputProps,open, acceptedFiles } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        noClick:true,
        maxFiles: 1
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://localhost:3000/envio-oferta/uploadOferta', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 201) {
                    console.log("O envio deu certo baby");
                    console.log(response.data);
                    setErros(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <main >
            <Header title="Upload Oferta de Disciplinas" />
            <h2 className={`${style.titlePage}`}>Oferta de Disciplinas</h2>
            <form onSubmit={handleSubmit} className={`${style.form}`}>
                <div {...getRootProps()} className={`${style.containeDropZone}`}>
                    <input {...getInputProps()}  />
                    <i className={`fa-solid fa-paper-plane ${style.icon}`}></i>
                    <p  className={`${style.p}`}>Você pode arrastar seu arquivo ou clicar no botão.</p>
                    <button className={`${style.buttonSelect}`} type="button" onClick={open}>
                        Selecionar Arquivo
                    </button>
                </div>
                {fileSelected && <p className={`${style.pArquivoSelecionado}`}><span className={`${style.spanArquivo}`}>Arquivo selecionado:</span> {file?.name} </p>}
                <Button className={`${style.buttonUpload}`} variant="contained" color="primary" type="submit" disabled={!fileSelected}>
                    Upload
                </Button>
            </form>
            {erros && erros?.length > 0 ? <RelatorioErros erros={erros}/> : null}
        </main>
    );
}

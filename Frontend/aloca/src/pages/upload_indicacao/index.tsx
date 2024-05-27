import React from 'react';
import { useDropzone } from 'react-dropzone';
import Header from "@/components/Header";
import { Button, CircularProgress } from '@mui/material';
import style from '@/styles/dropzone.module.css'
import axios from "axios";
import RelatorioErros from '@/components/RelatorioErros';
import Confirmacao from '@/components/Confirmacao';

interface Erro {
    linha: number;
    mensagem: string;
    valor_celula: string | number | null | undefined;
    tipo_esperado: string;
    detalhe: string | null;
}

interface Semestre{
    nome_semestre: string;
}

export default function Index() {
    const [file, setFile] = React.useState<File | null>(null);
    const [fileSelected, setFileSelected] = React.useState(false);
    const [semestre, setSemestre] = React.useState<Semestre>({ nome_semestre: "" });
    const [erros, setErros] = React.useState<Erro[]>([]);
    const [description, setDescription] = React.useState("");
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length) {
            setFile(acceptedFiles[0]);
            setFileSelected(true);
        }
    }, []);

    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        noClick: true,
        maxFiles: 1
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                setLoading(true); // Ativa o estado de carregamento
                const response = await axios.post('http://localhost:3000/envio-indicacao/uploadIndicacao', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 201) {
                    setErros(response.data);
                    setDescription("Arquivo enviado com sucesso!");
                    setOpenConfirmation(true);
                }
            } catch (error) {
                setLoading(false); // Desativa o estado de carregamento
                setDescription("Erro ao enviar o arquivo! Por favor, verifique o arquivo e tente novamente.");
                setOpenConfirmation(true);
            } finally {
                setLoading(false); // Desativa o estado de carregamento
            }
        }
    }

    React.useEffect(() =>{
        const fetchSemestreLatest = async () =>{
            try {
                const response = await axios.get<Semestre>(`http://localhost:3000/semestre/lastest`);
                setSemestre(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchSemestreLatest();
    }, []);

    return (
        <main >
            <Header title="Upload Indicação de Docentes" />
            <h2 className={`${style.titlePage}`}>Indicação de Docentes: <span className={`${style.spanSemestre}`}>{semestre?.nome_semestre ?? "Carregando..."}</span> </h2>
            <form onSubmit={handleSubmit} className={`${style.form}`}>
                <div {...getRootProps()} className={`${style.containeDropZone}`}>
                    <input {...getInputProps()} />
                    <i className={`fa-solid fa-paper-plane ${style.icon}`}></i>
                    <p className={`${style.p}`}>Você pode arrastar seu arquivo ou clicar no botão.</p>
                    <button className={`${style.buttonSelect}`} type="button" onClick={open}>
                        Selecionar Arquivo
                    </button>
                </div>
                {fileSelected && <p className={`${style.pArquivoSelecionado}`}><span className={`${style.spanArquivo}`}>Arquivo selecionado:</span> {file?.name} </p>}
                <Button className={`${style.buttonUpload}`} variant="contained" color="primary" type="submit" disabled={!fileSelected}>
                    Upload
                </Button>
            </form>
            {loading ? (
                <CircularProgress className={`${style.centeredProgress}`} size={70} /> // Renderiza o CircularProgress enquanto o envio está em andamento
            ) : (
                erros && erros?.length > 0 ? (
                    <RelatorioErros erros={erros} /> // Renderiza o RelatorioErros se houver erros
                ) : null
            )}

            <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description={description} />
        </main>
    );
}
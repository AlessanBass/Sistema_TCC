import Confirmacao from "@/components/Confirmacao";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import style from '@/styles/dropzone.module.css'
import styleGenerate from '@/styles/generateExcel.module.css';
import { Button } from "@mui/material";
import axios from "axios";
import React from "react";

interface Semestre {
    id_semestre: number;
    nome_semestre: string;
}

interface Area {
    id_area: number;
    nome_area: string;
}


export default function Index() {
    const [semestres, setSemestres] = React.useState<Semestre[] | undefined>(undefined);
    const [areas, setAreas] = React.useState<Area[]>();
    const [selectedArea, setSelectedArea] = React.useState<number | undefined>();
    const [selectedSemestre, setSemestre] = React.useState<number | undefined>();
    const [selectedOption, setSelectedOption] = React.useState<number | undefined>();
    const [description, setDescription] = React.useState("");
    const [openConfirmation, setOpenConfirmation] = React.useState(false);

    React.useEffect(() => {
        const fetchSemestreLatest = async () => {
            try {
                const response = await axios.get<Semestre[]>(`http://localhost:3000/semestre`);
                setSemestres(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchSemestreLatest();
    }, []);

    React.useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response_areas = await axios.get("http://localhost:3000/area");
                setAreas(response_areas.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAreas();
    }, []);

    const handleAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArea(Number(event.target.value));
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(Number(event.target.value));
    };

    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre(Number(event.target.value));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Area: " + selectedArea);
        console.log("Semestre " + selectedSemestre);
        /* console.log(semestre.id_semestre); */
        if (selectedOption === 1) {
            try {
                const response = await axios.get(`http://localhost:3000/envio-oferta/downloadByArea/${selectedArea}/${selectedSemestre}`);
                if (response.status === 200) {
                    const url = `http://localhost:3000/envio-oferta/downloadByArea/${selectedArea}/${selectedSemestre}`;
                    window.open(url, '_blank');
                    setDescription("Planilha Gerada Com Sucesso!");
                    setOpenConfirmation(true);
                }
            } catch (error) {
                setDescription("Erro tentar gerar Planilha!");
                setOpenConfirmation(true);
            }
        } else {
            try {
                const response = await axios.get(`http://localhost:3000/envio-indicacao/downloadByColegiado/${selectedArea}/${selectedSemestre}`);
                if (response.status === 200) {
                    const url = `http://localhost:3000/envio-indicacao/downloadByColegiado/${selectedArea}/${selectedSemestre}`;
                    window.open(url, '_blank');
                    setDescription("Planilha Gerada Com Sucesso!");
                    setOpenConfirmation(true);
                }

            } catch (error) {
                setDescription("Erro tentar gerar Planilha!");
                setOpenConfirmation(true);
            }
        }
    }

    return (
        <main>
            <Header title="Gerar Planilhas" />
            <h2 className={`${style.titlePage}`}>Gerar Planilhas</h2>
            <div className={`${styleGenerate.containnerForm}`}>
                <form onSubmit={handleSubmit} className={`${styleGenerate.form}`}>
                    <i className={`fa-solid fa-download ${styleGenerate.icon}`}></i>
                    <select name="selecao" id="selecao" onChange={handleOptionChange} className={styleGenerate.select}>
                        <option value="0" className={styleGenerate.option}>Selecione uma opção</option>
                        <option value="1" className={styleGenerate.option}>Gerar Planilha Com As Ofertas</option>
                        <option value="2" className={styleGenerate.option}>Gerar Planilha Para Envio Sei</option>
                    </select>

                    <select name="selecaoArea" id="selecaoArea" onChange={handleAreaChange} className={styleGenerate.select}>
                        <option value="0" className={styleGenerate.option}>Selecione uma área</option>
                        {areas?.map((area: Area) => (
                            <option key={area.id_area} value={area.id_area} className={styleGenerate.option}>
                                {area.nome_area}
                            </option>
                        ))}
                    </select>

                    <select name="selecaSemestre" id="selecaoSemestre" onChange={handleSemestreChange} className={styleGenerate.select}>
                        <option value="0" className={styleGenerate.option}>Selecione um semestre</option>
                        {semestres?.map((semestre: Semestre) => (
                            <option key={semestre.id_semestre} value={semestre.id_semestre} className={styleGenerate.option}>
                                {semestre.nome_semestre}
                            </option>
                        ))}
                    </select>

                    <Button type="submit" variant="contained" color="primary" disabled={!selectedArea || !selectedOption || !selectedSemestre}>
                        Gerar Planilha
                    </Button>
                </form>
                <Confirmacao open={openConfirmation} setOpen={setOpenConfirmation} description={description} />
            </div>
                <Footer/>
        </main>
    );
}
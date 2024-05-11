import Header from "@/components/Header";
import { Button } from '@mui/material';
import axios from "axios";
import { useRef } from "react";

export default function Index(){
    const fileInput = useRef<HTMLInputElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (fileInput.current?.files) {
            const formData = new FormData();
            formData.append('file', fileInput.current.files[0]);

            try {
                const response = await axios.post('http://localhost:3000/oferta/uploadOferta', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                /* console.log(response); retorna 201*/
            } catch (error) {
                console.error(error);
            }
        }
    }
    

    return(
        <div> {/* Trocar essa div para main */}
            <Header title="Upload Oferta de Disciplinas"/>
            <h1>Aqui vai ter um form</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" name="upload_oferta" id="excel_oferta" accept=".xls,.xlsx" ref={fileInput} />
                <Button variant="contained" color="primary" type="submit">
                    Upload
                </Button>
            </form>
        </div>
        
    );
}
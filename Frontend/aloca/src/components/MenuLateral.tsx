import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import style from '@/styles/menuLateral.module.css';
import TableProfessor from './TableProfessor';
import axios from 'axios'
import ModalProfessorCreate from './ModalProfessorCreate';
import Confirmacao from './Confirmacao';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Area {
  id_area: number;
  nome_area: string;
  // Adicione aqui outros campos conforme necessário
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function MenuLateral() {
  const [value, setValue] = React.useState(0);
  const [professor, setProfessor] = React.useState(null);
  const [area, setArea] = React.useState<any[]>();
  const [areaIdToIndex, setAreaIdToIndex] = React.useState<Record<string, any>>({});

  React.useEffect(()=>{
    const fetchData = async() =>{
      try{
        const response1 = await axios.get("http://localhost:3000/professor");
        const response2 = await axios.get<Area[]>("http://localhost:3000/area");
        setProfessor(response1.data);
        setArea(response2.data);

        // Criar um objeto de mapeamento para mapear id_area para índice
        const idToIndex: { [key: number]: number } = {};
        response2.data.forEach((area, index) => {
          idToIndex[area.id_area] = index;
        });
        setAreaIdToIndex(idToIndex);

        //Se houver pelo menos uma área, faça uma solicitação à API para os professores dessa área
      if (response2.data.length > 0) {
        const firstArea = response2.data[0];
        const response1 = await axios.get(`http://localhost:3000/professor?area=${firstArea.id_area}`);
        setProfessor(response1.data);
      }
      }catch(e){
        console.log(e)
      }
    }

    fetchData();
  }, []);

  
  // voltar
  const handleChange = async (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    /* console.log("Cliquei aqiu: " + newValue); */

    if (area) {
      // Encontre a área correspondente ao índice
      const selectedArea = area[newValue];
      //console.log(selectedArea);
  
      // Faça uma requisição à API para obter os professores dessa área
      try {
        const response = await axios.get(`http://localhost:3000/professor?area=${selectedArea.id_area}`);
        setProfessor(response.data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <div className={`${style.containerFiltro}`}>
        <h2 className={`${style.titlePage}`}>Filtrar Professores por área</h2>
       {/*  <ModalProfessorCreate /> */}
      </div>
      
      <Box
        sx={{ bgcolor: 'background.paper', display: 'flex' }}
        className={`${style.tabs}`} 

      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}

        >
          
          {area && area.map((area) => (
            <Tab key={area.id_area} label={area.nome_area} {...a11yProps(areaIdToIndex[area.id_area])} className={style.tab} />
          ))}
        </Tabs>
        <div className={style.tabPanel}>
        {area && area.map((area) => (
            <TabPanel key={areaIdToIndex[area.id_area]} value={value} index={areaIdToIndex[area.id_area]}>
              {professor ? <TableProfessor professores={professor ?? []} /> : 'Loading...'}
            </TabPanel>
          ))}
        </div>

      </Box>
      <ModalProfessorCreate />
    </>
  );
}
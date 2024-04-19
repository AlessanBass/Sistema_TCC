import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import style from '@/styles/menuLateral.module.css'
import Main from './Main';
import { TablePagination } from '@mui/material';
import TableProfessor from './TableProfessor';
import axios from 'axios'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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

  React.useEffect(()=>{
    const fetchData = async() =>{
      try{
        const response1 = await axios.get("http://localhost:3000/professor");
        const response2 = await axios.get("http://localhost:3000/area");
        setProfessor(response1.data);
        setArea(response2.data);
      }catch(e){
        console.log(e)
      }
    }

    fetchData();
  }, []);

  // voltar
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    console.log("Cliquei aqiu: " + newValue);
  };

  return (
    <>
      <h2 className={`${style.titlePage}`}>Filtrar Professores por área</h2>
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
          
          {area && area.map((area, index) => (
            <Tab key={area.id_area} label={area.nome_area} {...a11yProps(area.id_area)} className={style.tab} />
          ))}
        </Tabs>
        <div className={style.tabPanel}>
        {area && area.map((area, index) => (
            <TabPanel key={index} value={value} index={area.id_area}>
              {professor ? <TableProfessor professores={professor ?? []} /> : 'Loading...'}
            </TabPanel>
          ))}
        </div>

      </Box>
    </>
  );
}
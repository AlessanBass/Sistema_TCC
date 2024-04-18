import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import style from '@/styles/menuLateral.module.css'
import Main from './Main';
import { TablePagination } from '@mui/material';
import TableProfessor from './TableProfessor';

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
          <Tab label="Computação" {...a11yProps(0)} className={`${style.tab}`} />
          <Tab label="Eng. Civil" {...a11yProps(1)} className={`${style.tab}`} />
          <Tab label="Eng. de Produção" {...a11yProps(2)} className={`${style.tab}`} />
          <Tab label="Eng. Mecânica" {...a11yProps(3)} className={`${style.tab}`} />
          <Tab label="Eng. Química" {...a11yProps(4)} className={`${style.tab}`} />
        </Tabs>
        <div className={style.tabPanel}>
          <TabPanel value={value} index={0}>
              <TableProfessor />
          </TabPanel>
        </div>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={4}>
          Item Three
        </TabPanel>

      </Box>
    </>
  );
}
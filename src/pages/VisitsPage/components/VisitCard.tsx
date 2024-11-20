// VisitCard.tsx
import React from 'react';
import { Card, CardHeader, CardBody } from 'react-bootstrap';
import Visit from './Visit';
import { Box } from '@mui/material';

interface VisitCardProps {
  visits: any;
  value: number;
}

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const VisitCard: React.FC<VisitCardProps> = ({ visits, value }) => {
  return (
    <Card style={{ border: 'none' }}>
      <CardHeader
        style={{
          backgroundColor: '#cfe2ff',
          fontWeight: 'bold',
          textAlign: 'center',
          border: 'none',
        }}
      >
        <h5>Информация о визитах</h5>
      </CardHeader>
      <CardBody style={{ borderRadius: '0 0 25px 25px', padding: '20px' }}>
        <TabPanel value={value} index={0}>
          {visits && <Visit visit={visits} isPrimary={true} />}
        </TabPanel>
        {visits?.subRows?.map((repeat_visit: any, index: number) => (
          <TabPanel key={repeat_visit.id} value={value} index={index + 1}>
            <Visit visit={repeat_visit} isPrimary={false} />
          </TabPanel>
        ))}
      </CardBody>
    </Card>
  );
};

export default VisitCard;
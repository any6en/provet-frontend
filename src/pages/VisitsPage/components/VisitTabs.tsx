import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { formatDateDMYDT } from '../../../utils/dateFormatter';

interface VisitTabsProps {
  visits: any;
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const VisitTabs: React.FC<VisitTabsProps> = ({ visits, value, handleChange }) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        height: 'auto',
        borderRadius: '25px',
        border: '1px solid #dee2e6',
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab
          label={
            <span>
              Первичный
              <br />
              {formatDateDMYDT(visits?.date_visit, false, true)}
            </span>
          }
        />
        {visits?.subRows?.map((repeat_visit: any, index: number) => (
          <Tab
            key={repeat_visit.id}
            label={
              <span>
                Вторичный
                <br />
                {formatDateDMYDT(repeat_visit.date_visit, false, true)}
              </span>
            }
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default VisitTabs;

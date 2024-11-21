import { FC } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { ArrowClockwise, PlusLg, QuestionCircle } from 'react-bootstrap-icons';
import { userSlice } from '../../../store/reducers/UserSlice/UserSlice';

interface TableToolbarProps {
  fetchPatients: () => Promise<void>;
  dispatch: any;
}

const TableToolbar: FC<TableToolbarProps> = ({ fetchPatients, dispatch }) => {
  const { setShowModalAddPatient } = userSlice.actions;

  return (
    <Box className="d-flex flex-nowrap align-items-center align-content-start">
      <Tooltip arrow title="Обновить">
        <IconButton onClick={fetchPatients}>
          <ArrowClockwise />
        </IconButton>
      </Tooltip>
      <Tooltip arrow title="Добавить нового пациента">
        <IconButton onClick={() => dispatch(setShowModalAddPatient(true))}>
          <PlusLg color="green" size={20} />
        </IconButton>
      </Tooltip>
      <Tooltip arrow title="Получить справку">
        <IconButton
          onClick={() => {
            /* infoHandler здесь */
          }}
        >
          <QuestionCircle color="gray" size={20} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TableToolbar;

import { FC } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { ArrowClockwise, PlusLg, QuestionCircle } from 'react-bootstrap-icons';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { infoHandler } from '../../../../utils/alarmHandler';

const TableToolbar: FC = () => {
  const dispatch = useAppDispatch();

  const { setShowModalAddPatient, setIsReloadTable } = userSlice.actions;

  return (
    <Box className="d-flex flex-nowrap align-items-center align-content-start">
      <Tooltip arrow title="Обновить">
        <IconButton onClick={() => dispatch(setIsReloadTable(true))}>
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
            infoHandler('Пока что пусто');
          }}
        >
          <QuestionCircle color="gray" size={20} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TableToolbar;

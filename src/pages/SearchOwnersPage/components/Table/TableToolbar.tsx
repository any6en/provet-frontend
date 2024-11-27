import { FC } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { ArrowClockwise, PlusLg, QuestionCircle } from 'react-bootstrap-icons';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';

const TableToolbar: FC = () => {
  const dispatch = useAppDispatch();
  const { setShowModalAddOwner, setIsReloadTable } = userSlice.actions;

  return (
    <Box className="d-flex flex-nowrap align-items-center align-content-start">
      <Tooltip arrow title="Обновить">
        <IconButton onClick={() => dispatch(setIsReloadTable(true))}>
          <ArrowClockwise />
        </IconButton>
      </Tooltip>
      <Tooltip arrow title="Добавить нового владельца">
        <IconButton onClick={() => dispatch(setShowModalAddOwner(true))}>
          <PlusLg color="green" size={20} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TableToolbar;

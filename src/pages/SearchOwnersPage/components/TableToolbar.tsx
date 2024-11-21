import { FC } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { ArrowClockwise, PlusLg, QuestionCircle } from 'react-bootstrap-icons';
import { useAppDispatch } from '../../../hooks/redux';
import { userSlice } from '../../../store/reducers/UserSlice/UserSlice';
import { Spinner } from 'react-bootstrap';

interface TableToolbarProps {
  fetch: () => Promise<void>;
  isReloadTable: boolean;
}

const TableToolbar: FC<TableToolbarProps> = ({ fetch, isReloadTable }) => {
  const dispatch = useAppDispatch();
  const { setShowModalAddOwner } = userSlice.actions;

  return (
    <Box className="d-flex flex-nowrap align-items-center align-content-start">
      <Tooltip arrow title="Обновить">
        <IconButton onClick={fetch}>
          {!isReloadTable ? <ArrowClockwise /> : <Spinner variant="primary" size="sm" />}
        </IconButton>
      </Tooltip>
      <Tooltip arrow title="Добавить нового владельца">
        <IconButton onClick={() => dispatch(setShowModalAddOwner(true))}>
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

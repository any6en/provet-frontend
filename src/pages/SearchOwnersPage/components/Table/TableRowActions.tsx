import { FC } from 'react';
import { MenuItem, ListItemIcon } from '@mui/material';
import { Pencil, Trash } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import { IOwner } from '../../../../store/reducers/UserSlice/UserSliceTypes';
import { useAppDispatch } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { URL_PROVET_API } from '../../../../config/config';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../../utils/alarmHandler';

interface TableRowActionsProps {
  owner: any;
  closeMenu: () => void;
}

const TableRowActions: FC<TableRowActionsProps> = ({ owner, closeMenu }) => {
  const dispatch = useAppDispatch();
  const { setSelectedOwner, setShowModalChangeOwner } = userSlice.actions;

  const { setIsReloadTable } = userSlice.actions;

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Вы уверены?',
      text: 'Отменить удаление нельзя...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да',
    });

    if (result.isConfirmed) {
      axios
        .delete(`${URL_PROVET_API}directories/owners/owner/${owner.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          dispatch(setIsReloadTable(true));
          successHandler('Запись была удалена');
        })
        .catch((error) => {
          errorHandler(error);
        });
    }
    closeMenu();
  };

  return (
    <>
      <MenuItem
        onClick={() => {
          dispatch(setSelectedOwner(owner));
          dispatch(setShowModalChangeOwner(true));
          closeMenu();
        }}
      >
        <ListItemIcon>
          <Pencil />
        </ListItemIcon>
        Изменить
      </MenuItem>
      <MenuItem onClick={() => handleDelete()}>
        <ListItemIcon>
          <Trash />
        </ListItemIcon>
        Удалить
      </MenuItem>
    </>
  );
};

export default TableRowActions;

import React from 'react';
import { ListItemIcon, MenuItem } from '@mui/material';
import { Pencil, Trash } from 'react-bootstrap-icons';
import { useAppDispatch } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import Swal from 'sweetalert2';
import axios from 'axios';
import { URL_PROVET_API } from '../../../../config/config';
import { errorHandler, successHandler } from '../../../../utils/alarmHandler';

interface TableRowActionsProps {
  patient: any;
  closeMenu: () => void;
}

const TableRowActions: React.FC<TableRowActionsProps> = ({ patient, closeMenu }) => {
  const dispatch = useAppDispatch();
  const { setShowModalChangePatient, setSelectedPatient } = userSlice.actions;

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
        .delete(`${URL_PROVET_API}directories/patients/patient/${patient.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          setIsReloadTable(true);
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
          dispatch(setSelectedPatient(patient));
          dispatch(setShowModalChangePatient(true));
          closeMenu();
        }}
      >
        <ListItemIcon>
          <Pencil />
        </ListItemIcon>
        Изменить
      </MenuItem>
      <MenuItem onClick={handleDelete}>
        <ListItemIcon>
          <Trash />
        </ListItemIcon>
        Удалить
      </MenuItem>
    </>
  );
};

export default TableRowActions;

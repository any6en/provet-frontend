import { FC } from 'react';
import { MenuItem, ListItemIcon } from '@mui/material';
import { Pencil, Trash } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import { IOwner } from '../../../store/reducers/UserSlice/UserSliceTypes';
import { useAppDispatch } from '../../../hooks/redux';
import { userSlice } from '../../../store/reducers/UserSlice/UserSlice';

interface OwnerTableRowActionsProps {
  row: any;
  closeMenu: () => void;
  handleDeleteOwner: (ownerId: number) => Promise<void>;
}

const OwnerTableRowActions: FC<OwnerTableRowActionsProps> = ({
  row,
  closeMenu,
  handleDeleteOwner,
}) => {
  const dispatch = useAppDispatch();
  const { setSelectedOwner, setShowModalChangeOwner } = userSlice.actions;

  return (
    <>
      <MenuItem
        onClick={() => {
          dispatch(setSelectedOwner(row.original));
          dispatch(setShowModalChangeOwner(true));
          closeMenu();
        }}
      >
        <ListItemIcon>
          <Pencil />
        </ListItemIcon>
        Изменить
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleDeleteOwner(row.original.id);
          closeMenu();
        }}
      >
        <ListItemIcon>
          <Trash />
        </ListItemIcon>
        Удалить
      </MenuItem>
    </>
  );
};

export default OwnerTableRowActions;

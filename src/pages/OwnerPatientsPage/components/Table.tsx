import { FC } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import { ArrowClockwise, Pencil, PlusLg, QuestionCircle, Trash } from 'react-bootstrap-icons';
import { IPatient } from '../../Directories/PatientsPage/IPatients';
import { formatDate, formatDate2 } from '../../../utils/dateFormatter';
import TableToolbar from './TableToolbar';
import { useNavigate } from 'react-router-dom';

interface TableProps {
  patients: IPatient[];
  fetchPatients: () => Promise<void>;
  handleDeletePatient: (patientId: number) => Promise<void>;
  dispatch: any;
}

const Table: FC<TableProps> = ({ patients, fetchPatients, handleDeletePatient, dispatch }) => {
  const navigate = useNavigate();

  const columns: MRT_ColumnDef<IPatient>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 10,
      Cell: ({ row }) => row.original.id,
    },
    {
      accessorKey: 'nickname',
      header: 'Кличка',
      size: 150,
      Cell: ({ row }) => row.original.nickname,
    },
    {
      accessorKey: 'animal_type_name',
      header: 'Вид',
      size: 150,
      Cell: ({ row }) => row.original.animal_type_name,
    },
    {
      accessorKey: 'breed_name',
      header: 'Порода',
      size: 150,
      Cell: ({ row }) => row.original.breed_name,
    },
    {
      accessorKey: 'age',
      header: 'Дата рождения',
      size: 100,
      Cell: ({ row }) => formatDate2(row.original.date_birth),
    },
    {
      accessorKey: 'gender',
      header: 'Пол',
      size: 200,
      Cell: ({ row }) => (row.original.gender === 1 ? 'Самец' : 'Самка'),
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата создания профиля',
      size: 200,
      Cell: ({ row }) => formatDate(row.original.created_at),
    },
  ];

  const table = useMaterialReactTable({
    columns: columns,
    localization: MRT_Localization_RU,
    data: patients,
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        navigate(`/patient/${row.original.id}`);
      },
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: '70vh',
        overflow: 'auto',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#f5f5f5',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#099',
        color: '#fff',
        fontWeight: 'bold',
        padding: '12px',
        borderBottom: '1px solid #dee2e6',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        padding: '12px',
        borderBottom: '1px solid #dee2e6',
      },
    },
    renderTopToolbarCustomActions: () => (
      <TableToolbar fetchPatients={fetchPatients} dispatch={dispatch} />
    ),
    enableRowActions: true,
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <MenuItem
        key={0}
        onClick={() => {
          closeMenu();
        }}
      >
        <ListItemIcon>
          <Pencil />
        </ListItemIcon>
        Изменить
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          handleDeletePatient(row.original.id);
          fetchPatients();
          closeMenu();
        }}
      >
        <ListItemIcon>
          <Trash />
        </ListItemIcon>
        Удалить
      </MenuItem>,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default Table;

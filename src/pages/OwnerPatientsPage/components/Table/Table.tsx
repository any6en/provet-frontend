import { FC } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { IPatient } from '../../../Directories/PatientsPage/IPatients';
import { formatDateDMYDT } from '../../../../utils/dateFormatter';
import TableToolbar from './TableToolbar';
import { useNavigate } from 'react-router-dom';
import TableRowActions from './TableRowActions';
import { Checkbox } from '@mui/material';

interface TableProps {
  patients: IPatient[];
  isLoadMatrix: boolean;
}

const Table: FC<TableProps> = ({ patients, isLoadMatrix }) => {
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
      Cell: ({ row }) => formatDateDMYDT(row.original.date_birth, false, true),
    },
    {
      accessorKey: 'gender',
      header: 'Пол',
      size: 200,
      Cell: ({ row }) => (row.original.gender === 1 ? 'Самец' : 'Самка'),
    },
    {
      accessorKey: 'color',
      header: 'Окрас',
      size: 100,
      Cell: ({ row }) => (row.original.color ? row.original.color : '—'),
    },
    {
      accessorKey: 'is_castrated',
      header: 'Кастрирован',
      size: 50,
      Cell: ({ cell }) => <Checkbox checked={cell.getValue<boolean>()} disabled={true} />,
      accessorFn: (row) => row.is_castrated,
      filterVariant: 'checkbox',
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата создания профиля',
      size: 200,
      Cell: ({ row }) => formatDateDMYDT(row.original.created_at, true, true),
    },
  ];

  const table = useMaterialReactTable({
    columns: columns,
    localization: MRT_Localization_RU,
    data: patients,
    state: {
      isLoading: isLoadMatrix,
      showProgressBars: isLoadMatrix,
      density: 'compact',
    },
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
    renderTopToolbarCustomActions: () => <TableToolbar />,
    enableRowActions: true,
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <TableRowActions patient={row.original} closeMenu={closeMenu} />,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default Table;

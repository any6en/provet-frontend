import { FC } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { formatDate, formatDate2 } from '../../../utils/dateFormatter';
import { useAppSelector } from '../../../hooks/redux';
import { IOwner } from '../../../store/reducers/UserSlice/UserSliceTypes';
import { useNavigate } from 'react-router-dom';
import OwnerTableRowActions from './OwnerTableRowActions';
import OwnerTableToolbar from './OwnerTableToolbar';

interface OwnerTableProps {
  owners: IOwner[];
  isLoadMatrix: boolean;
  fetch: () => Promise<void>;
  handleDeleteOwner: (ownerId: number) => Promise<void>;
}

const OwnerTable: FC<OwnerTableProps> = ({ owners, isLoadMatrix, fetch, handleDeleteOwner }) => {
  const navigate = useNavigate();
  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable); // Извлекаем isReloadTable из Redux

  const columns: MRT_ColumnDef<IOwner>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 10,
      Cell: ({ row }) => row.original.id,
    },
    {
      accessorKey: 'lastName',
      header: 'Фамилия',
      size: 150,
      Cell: ({ row }) => row.original.last_name,
    },
    {
      accessorKey: 'firstName',
      header: 'Имя',
      size: 150,
      Cell: ({ row }) => row.original.first_name,
    },
    {
      accessorKey: 'patronymic',
      header: 'Отчество',
      size: 150,
      Cell: ({ row }) => row.original.patronymic,
    },
    {
      accessorKey: 'address',
      header: 'Адрес проживания',
      size: 200,
      Cell: ({ row }) => row.original.address,
    },
    {
      accessorKey: 'dateBirth',
      header: 'Дата рождения',
      size: 100,
      Cell: ({ row }) => formatDate2(row.original.date_birth),
    },
    {
      accessorKey: 'gender',
      header: 'Пол',
      size: 200,
      Cell: ({ row }) => (row.original.gender === 1 ? 'Мужской' : 'Женский'),
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
    data: owners,
    state: {
      isLoading: isLoadMatrix,
      showProgressBars: isLoadMatrix,
      density: 'compact',
    },
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        navigate(`/patients_of_owner/${row.original.id}`);
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
      <OwnerTableToolbar fetch={fetch} isReloadTable={isReloadTable} /> // Передаем isReloadTable
    ),
    enableRowActions: true,
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <OwnerTableRowActions
        row={row}
        closeMenu={closeMenu}
        handleDeleteOwner={handleDeleteOwner}
      />,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default OwnerTable;

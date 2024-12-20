import { FC } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { formatDateDMYDT } from '../../../../utils/dateFormatter';
import { useAppSelector } from '../../../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import TableRowActions from './TableRowActions';
import TableToolbar from './TableToolbar';
import { IOwner } from '../../../../store/reducers/UserSlice/UserSliceTypes';

interface TableProps {
  owners: IOwner[];
  isLoadMatrix: boolean;
}

const Table: FC<TableProps> = ({ owners, isLoadMatrix }) => {
  const navigate = useNavigate();
  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);

  const columns: MRT_ColumnDef<IOwner>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      filterFn: 'contains',
      size: 10,
      Cell: ({ row }) => row.original.id,
    },
    {
      accessorKey: 'last_name',
      header: 'Фамилия',
      filterFn: 'contains',
      size: 150,
      Cell: ({ row }) => row.original.last_name,
    },
    {
      accessorKey: 'first_name',
      header: 'Имя',
      filterFn: 'contains',
      size: 150,
      Cell: ({ row }) => row.original.first_name,
    },
    {
      accessorKey: 'patronymic',
      header: 'Отчество',
      filterFn: 'contains',
      size: 150,
      Cell: ({ row }) => row.original.patronymic,
    },
    {
      accessorKey: 'phone_number',
      header: 'Номер телефона',
      filterFn: 'contains',
      size: 150,
      Cell: ({ row }) => (row.original.phone_number ? row.original.phone_number : '—'),
    },
    {
      accessorKey: 'address',
      header: 'Адрес проживания',
      filterFn: 'contains',
      size: 200,
      Cell: ({ row }) => row.original.address,
    },

    {
      accessorKey: 'date_birth',
      header: 'Дата рождения',
      enableColumnFilter: false,
      size: 100,
      Cell: ({ row }) =>
        row.original.date_birth ? formatDateDMYDT(row.original.date_birth, false, true) : '—',
    },
    {
      accessorKey: 'gender',
      header: 'Пол',
      enableColumnFilter: false,
      size: 200,
      Cell: ({ row }) => (row.original.gender === 1 ? 'Мужской' : 'Женский'),
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата создания профиля',
      enableColumnFilter: false,
      size: 200,
      Cell: ({ row }) => formatDateDMYDT(row.original.created_at, true, true),
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
      sx: {
        backgroundColor: row.original.pd_agreement_signed ? 'lightgreen' : 'lightcoral',
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
      <TableRowActions owner={row.original} closeMenu={closeMenu} />,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default Table;

import { FC, useState, useEffect } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { calculateAge, formatDate, formatDate2 } from '../../utils/dateFormatter';
import { Breadcrumb, Button, Container, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';
import { ArrowClockwise, PlusLg, QuestionCircle, Trash } from 'react-bootstrap-icons';
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import { URL_PROVET_API } from '../../config/config';
import axios from 'axios';
import Swal from 'sweetalert2';
import { IOwner } from '../../store/reducers/UserSlice/UserSliceTypes';
import { useNavigate } from 'react-router-dom';
import { infoHandler } from '../../utils/alarmHandler';

const SearchPatientsPage: FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [owners, setOwners] = useState<IOwner[]>([]);

  const [isLoadMatrix, setLoadMatrix] = useState<boolean>(true);

  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);

  const { setIsReloadTable, setShowModalAddOwner } = userSlice.actions;

  const fetch = async () => {
    setIsReloadTable(true);
    setLoadMatrix(true);

    axios
      .get(`${URL_PROVET_API}directories/owners`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setOwners(response.data.response.rows);
      })
      .catch(() => {})
      .finally(() => {
        setIsReloadTable(false);
        setLoadMatrix(false);
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  // Обновляем матрицу, флаг isReloadTable
  if (useAppSelector((state) => state.userReducer.isReloadTable)) {
    dispatch(setIsReloadTable(false));
    fetch();
  }

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
    },

    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        navigate(`/patients/${row.original.id}`);
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
      <Box className="d-flex flex-nowrap align-items-center align-content-start">
        <Tooltip arrow title="Обновить">
          <IconButton
            onClick={() => {
              fetch();
            }}
          >
            {!isReloadTable ? <ArrowClockwise /> : <Spinner variant="primary" size="sm" />}
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Добавить нового владельца">
          <IconButton
            onClick={() => {
              dispatch(setShowModalAddOwner(true));
            }}
          >
            <PlusLg color="green" size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Получить справку">
          <IconButton
            onClick={() => {
              infoHandler(
                'Вы можете отфильтровать, отсортировать, а также добавить нового владельца',
              );
            }}
          >
            <QuestionCircle color="gray" size={20} />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });
  return (
    <>
      <Container fluid className="py-2">
        <Breadcrumb style={{ backgroundColor: '#f5f5f5' }} className="p-2">
          <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
          <Breadcrumb.Item active>
            Быстрый поиск {isLoadMatrix && <Spinner variant="primary" size="sm" />}
          </Breadcrumb.Item>
        </Breadcrumb>
      </Container>
      <Container className="py-2">
        <p>Выберите в матрице нужного владельца</p>
        <MaterialReactTable table={table} />
      </Container>
    </>
  );
};

export default SearchPatientsPage;

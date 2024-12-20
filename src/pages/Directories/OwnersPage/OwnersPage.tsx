import { FC, useState, useEffect } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { Breadcrumb, Container, Spinner } from 'react-bootstrap';
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import { PlusLg, ArrowClockwise, Trash, QuestionCircle } from 'react-bootstrap-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import { userSlice } from '../../../store/reducers/UserSlice/UserSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { infoHandler } from '../../../utils/alarmHandler';
import { formatDate, formatDate2 } from '../../../utils/dateFormatter';
import { IOwner } from '../../../store/reducers/UserSlice/UserSliceTypes';
import config from '../../../config/config';

const OwnersPage: FC = () => {
  const dispatch = useAppDispatch();

  const [owners, setOwners] = useState<IOwner[]>([]);

  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);

  const { setIsReloadTable, setShowModalChangeOwner, setShowModalAddOwner, setSelectedOwner } =
    userSlice.actions;

  const fetchOwners = async () => {
    setIsReloadTable(true);

    if (config.url_provet_api) {
      axios
        .get(`${config.url_provet_api}directories/owners`, {
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
        });
    }
  };

  // Обновляем матрицу после изменения данных
  if (useAppSelector((state) => state.userReducer.isReloadTable)) {
    dispatch(setIsReloadTable(false));
    fetchOwners();
  }

  useEffect(() => {
    fetchOwners();
  }, []);

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

  const handleDeleteOwner = (ownerId: number) => {
    Swal.fire({
      title: 'Вы уверены?',
      text: 'Отменить удаление записи нельзя...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да',
    }).then((result) => {
      if (result.isConfirmed) {
        if (config.url_provet_api) {
          axios
            .delete(`${config.url_provet_api}directories/owners/owner/${ownerId}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then(() => {
              // Обновите состояние, чтобы удалить владельца из списка
              setOwners((prevOwners) => prevOwners.filter((owner) => owner.id !== ownerId));

              Swal.fire({
                title: 'Успешно!',
                text: 'Запись была удалена',
                icon: 'success',
              });
            })
            .catch(() => {
              Swal.fire({
                title: 'Провал!',
                text: 'Что-то пошло не так',
                icon: 'error',
              });
            })
            .finally(() => {
              // Завершена операция удаления
              console.log('Удаление завершено для владельца с ID:', ownerId);
            });
        }
      }
    });
  };

  const table = useMaterialReactTable({
    columns: columns,
    localization: MRT_Localization_RU,
    data: owners,
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        dispatch(setSelectedOwner(row.original));
        dispatch(setShowModalChangeOwner(true));
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
              fetchOwners();
            }}
          >
            <ArrowClockwise />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Добавить владельца">
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
                'Справка\nЭто справочник владельцев питомцев.\nТут вы можете увидеть все записи в табличном виде.',
              );
            }}
          >
            <QuestionCircle color="gray" size={20} />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    enableRowActions: true,
    initialState: {
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },

    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <MenuItem
        key={0}
        onClick={() => {
          handleDeleteOwner(row.original.id);
          fetchOwners();
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
  return (
    <>
      <Container fluid className="py-2">
        <Breadcrumb style={{ backgroundColor: '#f5f5f5' }} className="p-2">
          <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
          <Breadcrumb.Item active>
            Владельцы {isReloadTable && <Spinner variant="primary" size="sm" />}
          </Breadcrumb.Item>
        </Breadcrumb>
        <MaterialReactTable table={table} />
      </Container>
    </>
  );
};

export default OwnersPage;

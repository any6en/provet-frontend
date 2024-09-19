import { FC, useState, useEffect } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { formatDate, formatDate2 } from '../../utils/dateFormatter';
import { Breadcrumb, Button, Container, Spinner } from 'react-bootstrap';
import { IBreed, IOwner, IPatient, ISpecie } from '../../store/reducers/UserSlice/UserSliceTypes';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';
import { ArrowClockwise, PlusLg, QuestionCircle, Trash } from 'react-bootstrap-icons';
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import { infoHandler } from '../../utils/alarmHandler';
import { URL_PROVET } from '../../config/config';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ReceptionPage: FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [owners, setOwners] = useState<IOwner[]>([]);
  const [breeds, setBreeds] = useState<IBreed[]>([]);
  const [species, setSpecies] = useState<ISpecie[]>([]);

  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);

  const { setIsReloadTable } = userSlice.actions;

  const fetchOwners = async () => {
    setIsReloadTable(true);
    if (URL_PROVET) {
      axios
        .get(`${URL_PROVET}owners`, {
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
  const fetchBreeds = async () => {
    setIsReloadTable(true);
    if (URL_PROVET) {
      axios
        .get(`${URL_PROVET}breeds`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setBreeds(response.data.response.rows);
        })
        .catch(() => {})
        .finally(() => {
          setIsReloadTable(false);
        });
    }
  };
  const fetchSpecies = async () => {
    setIsReloadTable(true);
    if (URL_PROVET) {
      axios
        .get(`${URL_PROVET}species`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setSpecies(response.data.response.rows);
        })
        .catch(() => {})
        .finally(() => {
          setIsReloadTable(false);
        });
    }
  };

  useEffect(() => {
    fetchSpecies();
    fetchBreeds();
    fetchOwners();
  }, []);

  // Обновляем матрицу после изменения данных роли устройства
  if (useAppSelector((state) => state.userReducer.isReloadTable)) {
    dispatch(setIsReloadTable(false));
    fetchSpecies();
    fetchBreeds();
    fetchOwners();
  }

  const handleDeletePatient = async (patientId: number) => {};

  const columns: MRT_ColumnDef<IOwner>[] = [
    {
      accessorKey: 'lastName',
      header: 'Фамилия',
      size: 150,
      Cell: ({ row }) => row.original.lastName,
    },
    {
      accessorKey: 'firstName',
      header: 'Имя',
      size: 150,
      Cell: ({ row }) => row.original.firstName,
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
      Cell: ({ row }) => formatDate2(row.original.dateBirth),
    },
    {
      accessorKey: 'gender',
      header: 'Пол',
      size: 200,
      Cell: ({ row }) => (row.original.gender === 1 ? 'Мужской' : 'Женский'),
    },
  ];

  const table = useMaterialReactTable({
    columns: columns,
    localization: MRT_Localization_RU,
    data: owners,
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
          handleDeletePatient(row.original.id);
          fetchSpecies();
          fetchBreeds();
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
            Начало приема {isReloadTable && <Spinner variant="primary" size="sm" />}
          </Breadcrumb.Item>
        </Breadcrumb>
      </Container>
      <Container className="py-2">
        <p className="text-center">
          Для продолжения выберите в таблице нужного владельца, а после раскройте его и выберите
          нужного пациента
        </p>
        <MaterialReactTable table={table} />
      </Container>
    </>
  );
};

export default ReceptionPage;

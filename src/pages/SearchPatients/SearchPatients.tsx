import { FC, useState, useEffect } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { calculateAge, formatDate, formatDate2 } from '../../utils/dateFormatter';
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

const SearchPatientsPage: FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState<any>([]);

  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);

  const { setIsReloadTable } = userSlice.actions;

  const fetchData = async () => {
    const fetch = async () => {
      setIsReloadTable(true);
      if (URL_PROVET) {
        axios
          .get(`${URL_PROVET}api/patients?includeOwners=true`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            setTableData(
              response.data.response.rows.map((item: any) => {
                return {
                  id: item.id,
                  nickname: item.nickname,
                  dateBirth: item.dateBirth,
                  animalTypeId: item.animalTypeId,
                  breedId: item.breedId,
                  ownerId: item.owner.id,
                  ownerFullName: `${item.owner.lastName} ${item.owner?.firstName} ${item.owner.patronymic}`,
                };
              }),
            );
          })
          .catch(() => {})
          .finally(() => {
            setIsReloadTable(false);
          });
      }
    };

    fetch();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Обновляем матрицу после изменения данных роли устройства
  if (useAppSelector((state) => state.userReducer.isReloadTable)) {
    dispatch(setIsReloadTable(false));
    fetchData();
  }

  const handleDeletePatient = async (patientId: number) => {};

  const columns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'nickname',
      header: 'Кличка',
      size: 100,
      Cell: ({ row }) => row.original.nickname,
    },
    {
      accessorKey: 'animalTypeId',
      header: 'Вид',
      size: 100,
      Cell: ({ row }) => row.original.animalTypeId,
    },
    {
      accessorKey: 'breedId',
      header: 'Порода',
      size: 100,
      Cell: ({ row }) => row.original.breedId,
    },
    {
      accessorKey: 'dateBirth',
      header: 'Дата рождения',
      size: 200,
      Cell: ({ row }) => formatDate2(row.original.dateBirth),
    },
    {
      accessorKey: 'ownerFullName',
      header: 'Владелец',
      size: 200,
      Cell: ({ row }) => row.original.ownerFullName,
    },
  ];

  const table = useMaterialReactTable({
    columns: columns,
    localization: MRT_Localization_RU,
    data: tableData,
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
              fetchData();
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
          fetchData();
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
            Быстрый поиск пациента {isReloadTable && <Spinner variant="primary" size="sm" />}
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

export default SearchPatientsPage;

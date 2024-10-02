import { FC, useState, useEffect, useRef } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { formatDate, formatDate2 } from '../../../utils/dateFormatter';
import { Breadcrumb, Container, Spinner } from 'react-bootstrap';
import { IBreed, IPatient, IAnimalType } from '../../../store/reducers/UserSlice/UserSliceTypes';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { userSlice } from '../../../store/reducers/UserSlice/UserSlice';
import { ArrowClockwise, PlusLg, QuestionCircle, Trash } from 'react-bootstrap-icons';
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import { infoHandler } from '../../../utils/alarmHandler';
import { URL_PROVET_API } from '../../../config/config';
import axios from 'axios';
import Swal from 'sweetalert2';
import ProvetAPI from '../../../utils/ProvetAPI';

const PatientsPage: FC = () => {
  const dispatch = useAppDispatch();

  const [patients, setPatients] = useState<IPatient[]>([]);
  const [breeds, setBreeds] = useState<IBreed[]>([]);
  const [animalTypes, setAnimalTypes] = useState<IAnimalType[]>([]);

  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);

  const controller = useRef(new AbortController());

  const {
    setIsReloadTable,
    setShowModalChangePatient,
    setShowModalAddPatient,
    setSelectedPatient,
  } = userSlice.actions;

  const fetchData = async () => {
    setIsReloadTable(true);

    const api = new ProvetAPI();

    // Получаем справочники
    let res: any = await api.getList('patients', controller.current, true);
    if (res) setPatients(res.rows);

    res = await api.getList('breeds', controller.current, true);
    if (res) setBreeds(res.rows);

    res = await api.getList('animal_types', controller.current, true);
    if (res) setAnimalTypes(res.rows);
  };

  useEffect(() => {
    // При монтировании компонента
    controller.current = new AbortController();

    fetchData();

    return () => {
      // При размонтировании компонента
      controller.current.abort();
    };
  }, []);

  // Обновляем матрицу после изменения данных роли устройства
  if (useAppSelector((state) => state.userReducer.isReloadTable)) {
    dispatch(setIsReloadTable(false));
    fetchData();
  }

  const handleDeletePatient = async (patientId: number) => {
    Swal.fire({
      title: 'Вы уверены?',
      text: 'Отменить удаление нельзя...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да',
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (URL_PROVET_API) {
          try {
            await axios.delete(`${URL_PROVET_API}directories/patients/patient/${patientId}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            // Обновите состояние, чтобы удалить владельца из списка
            setPatients((prevPatients) =>
              prevPatients.filter((patient) => patient.id !== patientId),
            );

            Swal.fire({
              title: 'Успешно!',
              text: 'Запись была удалена',
              icon: 'success',
            });
          } catch (error) {
            Swal.fire({
              title: 'Провал!',
              text: 'Что-то пошло не так',
              icon: 'error',
            });
          }
        }
      }
    });
  };

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
      accessorKey: 'specieId',
      header: 'Вид',
      size: 150,
      Cell: ({ row }) => {
        const specie: any = animalTypes.find((b) => b.id === row.original.animalTypeId);
        return specie.name;
      },
    },
    {
      accessorKey: 'breedId',
      header: 'Порода',
      size: 150,
      Cell: ({ row }) => {
        const breed: any = breeds.find((b) => b.id === row.original.breedId);
        return breed.name;
      },
    },
    {
      accessorKey: 'age',
      header: 'Дата рождения',
      size: 100,
      Cell: ({ row }) => formatDate2(row.original.dateBirth),
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
      Cell: ({ row }) => formatDate(row.original.createdAt),
    },
  ];

  const table = useMaterialReactTable({
    columns: columns,
    localization: MRT_Localization_RU,
    data: patients.length !== 0 && breeds.length !== 0 && animalTypes.length !== 0 ? patients : [],
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        dispatch(setSelectedPatient(row.original));
        dispatch(setShowModalChangePatient(true));
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
        <Tooltip arrow title="Добавить пациента">
          <IconButton
            onClick={() => {
              dispatch(setShowModalAddPatient(true));
            }}
          >
            <PlusLg color="green" size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Получить справку">
          <IconButton
            onClick={() => {
              infoHandler(
                'Справка\nЭто справочник пациентов питомцев.\nТут вы можете увидеть все записи в табличном виде.',
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
          handleDeletePatient(row.original.id);
          fetchData();
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
            Пациенты {isReloadTable && <Spinner variant="primary" size="sm" />}
          </Breadcrumb.Item>
        </Breadcrumb>
        <MaterialReactTable table={table} />
      </Container>
    </>
  );
};

export default PatientsPage;

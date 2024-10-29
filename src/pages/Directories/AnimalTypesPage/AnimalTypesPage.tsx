import { FC, useState, useEffect } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { Breadcrumb, Container, Spinner } from 'react-bootstrap';
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import { PlusLg, ArrowClockwise, Trash, QuestionCircle } from 'react-bootstrap-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { IAnimalType } from '../../../store/reducers/UserSlice/UserSliceTypes';
import { userSlice } from '../../../store/reducers/UserSlice/UserSlice';
import { URL_PROVET_API } from '../../../config/config';

const AnimalTypesPage: FC = () => {
  const dispatch = useAppDispatch();

  const [animalTypes, setAnimalTypes] = useState<IAnimalType[]>([]);

  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);

  const {
    setIsReloadTable,
    setShowModalChangeAnimalType,
    setShowModalAddAnimalType,
    setSelectedAnimalType,
  } = userSlice.actions;

  const fetchAnimalTypes = async () => {
    setIsReloadTable(true);
    axios
      .get(`${URL_PROVET_API}directories/animal_types`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setAnimalTypes(response.data.response.rows);
      })
      .catch(() => {})
      .finally(() => {
        setIsReloadTable(false);
      });
  };

  // Обновляем матрицу после изменения данных роли устройства
  if (useAppSelector((state) => state.userReducer.isReloadTable)) {
    dispatch(setIsReloadTable(false));
    fetchAnimalTypes();
  }

  useEffect(() => {
    fetchAnimalTypes();
  }, []);

  const columns: MRT_ColumnDef<IAnimalType>[] = [
    {
      accessorKey: 'id',
      header: 'Номер',
      size: 10,
      Cell: ({ row }) => row.original.id,
    },
    {
      accessorKey: 'name',
      header: 'Название',
      size: 150,
      Cell: ({ row }) => row.original.name,
    },
  ];

  const handleDeleteAnimalType = async (animalTypeId: number) => {
    Swal.fire({
      title: 'Вы уверены?',
      text: 'Отменить удаление невозможно',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${URL_PROVET_API}directories/animal_types/animal_type/${animalTypeId}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          // Обновите состояние, чтобы удалить владельца из списка
          setAnimalTypes((prevAnimalType) =>
            prevAnimalType.filter((animalType) => animalType.id !== animalTypeId),
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
    });
  };

  const table = useMaterialReactTable({
    columns: columns,
    localization: MRT_Localization_RU,
    data: animalTypes,
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        dispatch(setSelectedAnimalType(row.original));
        dispatch(setShowModalChangeAnimalType(true));
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
              fetchAnimalTypes();
            }}
          >
            <ArrowClockwise />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Добавить вид">
          <IconButton
            onClick={() => {
              dispatch(setShowModalAddAnimalType(true));
            }}
          >
            <PlusLg color="green" size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Получить справку">
          <IconButton onClick={() => {}}>
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
          handleDeleteAnimalType(row.original.id);
          fetchAnimalTypes();
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
            Виды животных {isReloadTable && <Spinner variant="primary" size="sm" />}
          </Breadcrumb.Item>
        </Breadcrumb>
        <MaterialReactTable table={table} />
      </Container>
    </>
  );
};

export default AnimalTypesPage;

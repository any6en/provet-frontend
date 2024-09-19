import { FC, useState, useEffect } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { Breadcrumb, Container, Spinner } from 'react-bootstrap';
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import { PlusLg, ArrowClockwise, Trash, QuestionCircle } from 'react-bootstrap-icons';
import axios from 'axios';
import { infoHandler } from '../../utils/alarmHandler';
import { URL_PROVET } from '../../config/config';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { ISpecie } from '../../store/reducers/UserSlice/UserSliceTypes';
import Swal from 'sweetalert2';

const LaboratoryPage: FC = () => {
  const dispatch = useAppDispatch();

  const [species, setSpecies] = useState<ISpecie[]>([]);

  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);

  const { setIsReloadTable, setShowModalChangeSpecie, setShowModalAddSpecie, setSelectedSpecie } =
    userSlice.actions;

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

  // Обновляем матрицу после изменения данных роли устройства
  if (useAppSelector((state) => state.userReducer.isReloadTable)) {
    dispatch(setIsReloadTable(false));
    fetchSpecies();
  }

  useEffect(() => {
    fetchSpecies();
  }, []);

  const columns: MRT_ColumnDef<ISpecie>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
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

  const handleDeleteSpecie = async (specieId: number) => {
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
        if (URL_PROVET) {
          try {
            await axios.delete(`${URL_PROVET}specie/${specieId}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            // Обновите состояние, чтобы удалить владельца из списка
            setSpecies((prevSpecies) => prevSpecies.filter((specie) => specie.id !== specieId));

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

  const table = useMaterialReactTable({
    columns: columns,
    localization: MRT_Localization_RU,
    data: species,
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        dispatch(setSelectedSpecie(row.original));
        dispatch(setShowModalChangeSpecie(true));
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
              fetchSpecies();
            }}
          >
            <ArrowClockwise />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Добавить вид">
          <IconButton
            onClick={() => {
              dispatch(setShowModalAddSpecie(true));
            }}
          >
            <PlusLg color="green" size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Получить справку">
          <IconButton
            onClick={() => {
              infoHandler(
                'Справка\nЭто справочник пород питомцев.\nТут вы можете увидеть все записи в табличном виде.',
              );
              console.log();
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
          handleDeleteSpecie(row.original.id);
          fetchSpecies();
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
            Виды {isReloadTable && <Spinner variant="primary" size="sm" />}
          </Breadcrumb.Item>
        </Breadcrumb>
        <MaterialReactTable table={table} />
      </Container>
    </>
  );
};

export default LaboratoryPage;

import { FC, useState, useEffect } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { Breadcrumb, Button, Container, Form, Row, Spinner } from 'react-bootstrap';
import { ArrowClockwise, PlusLg, QuestionCircle, Trash } from 'react-bootstrap-icons';
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { infoHandler } from '../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { userSlice } from '../../../store/reducers/UserSlice/UserSlice';
import { URL_PROVET_API } from '../../../config/config';
import { IJournal } from './IJournal';

interface Props {
  patient_id: number;
}

const PatientJournal: FC<Props> = ({ patient_id }) => {
  const dispatch = useAppDispatch();

  const { setIsReloadTable } = userSlice.actions;

  const [data, setData] = useState<IJournal[]>([]);

  const fetch = async () => {
    setIsReloadTable(true);
    if (URL_PROVET_API) {
      axios
        .get(`${URL_PROVET_API}journal`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setData(response.data.response.rows);
        })
        .catch(() => {})
        .finally(() => {
          setIsReloadTable(false);
        });
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // Обновляем матрицу, флаг isReloadTable
  if (useAppSelector((state) => state.userReducer.isReloadTable)) {
    dispatch(setIsReloadTable(false));
    fetch();
  }

  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);

  const columns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 10,
      Cell: ({ row }) => row.original.id,
    },
    {
      accessorKey: 'patronymic',
      header: 'Дата',
      size: 150,
      Cell: ({ row }) => row.original.date,
    },
    {
      accessorKey: 'lastName',
      header: 'Содержание',
      size: 150,
      Cell: ({ row }) => row.original.content,
    },

    {
      accessorKey: 'address',
      header: 'Врач',
      size: 200,
      Cell: ({ row }) => row.original.doctor,
    },
  ];

  const table = useMaterialReactTable({
    columns: columns,
    localization: MRT_Localization_RU,
    data: data,
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        //navigate(`/patients/${row.original.id}`);
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
              dispatch(setIsReloadTable(false));
              fetch();
            }}
          >
            {!isReloadTable ? <ArrowClockwise /> : <Spinner variant="primary" size="sm" />}
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Получить справку">
          <IconButton
            onClick={() => {
              infoHandler('Вы можете отфильтровать, отсортировать');
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
  });

  return (
    <Form className="px-3">
      <Row>
        <MaterialReactTable table={table} />
      </Row>
    </Form>
  );
};

export default PatientJournal;

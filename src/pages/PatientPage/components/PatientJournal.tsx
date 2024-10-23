import { FC, useState, useEffect } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { Breadcrumb, Button, Container, Form, Row, Spinner } from 'react-bootstrap';
import { ArrowClockwise, PlusLg, QuestionCircle, Trash } from 'react-bootstrap-icons';
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { infoHandler } from '../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { userSlice } from '../../../store/reducers/UserSlice/UserSlice';
import { URL_PROVET_API } from '../../../config/config';
import { IJournal } from './IJournal';
import { formatDate } from '../../../utils/dateFormatter';

interface Props {
  patient_id: number;
}

const PatientJournal: FC<Props> = ({ patient_id }) => {
  const dispatch = useAppDispatch();

  const { setIsReloadTable } = userSlice.actions;

  const [data, setData] = useState<IJournal[]>([]);
  const navigate = useNavigate();

  const fetch = async () => {
    setIsReloadTable(true);
    if (URL_PROVET_API) {
      axios
        .get(`${URL_PROVET_API}journal?owner_id=${patient_id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response);
          console.log(response.data.response.rows);
          setData(response.data.response.rows);
        })
        .catch(() => {})
        .finally(() => {
          setIsReloadTable(false);
        });
    }
  };

  useEffect(() => {
    if (patient_id) fetch();
  }, [patient_id]);

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
      accessorKey: 'date',
      header: 'Дата',
      size: 150,
      Cell: ({ row }) => row.original.date,
    },
    {
      accessorKey: 'content',
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

  let location = useLocation();

  const table = useMaterialReactTable({
    columns: columns,
    localization: MRT_Localization_RU,
    data: data,
    enableExpanding: true,
    getSubRows: (row) => row.subRows, //default
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        if (row.original.content === 'Первичный прием') {
          navigate(`/primary_visits/${row.original.id}`);
        }
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

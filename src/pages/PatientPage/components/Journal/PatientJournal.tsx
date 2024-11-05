import { FC, useState, useEffect } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { Breadcrumb, Button, Container, Form, Row, Spinner } from 'react-bootstrap';
import { ArrowClockwise, PlusLg, QuestionCircle, Trash } from 'react-bootstrap-icons';
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { infoHandler } from '../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { URL_PROVET_API } from '../../../../config/config';
import { IJournal } from './IJournal';
import { formatDate, formatDateDMYDT } from '../../../../utils/dateFormatter';

interface Props {
  patient: any;
}

const PatientJournal: FC<Props> = ({ patient }) => {
  const dispatch = useAppDispatch();

  const { setIsReloadTable, setShowModalAddPrimaryVisit, setSelectedPrimaryVisit } =
    userSlice.actions;

  const [data, setData] = useState<IJournal[]>([]);
  const navigate = useNavigate();

  const fetch = async () => {
    setIsReloadTable(true);

    axios
      .get(`${URL_PROVET_API}journal?patient_id=${patient?.id}`, {
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
  };

  useEffect(() => {
    if (patient) fetch();
  }, [patient]);

  // Обновляем матрицу, флаг isReloadTable
  if (useAppSelector((state) => state.userReducer.isReloadTable)) {
    dispatch(setIsReloadTable(false));
    fetch();
  }

  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);

  const columns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'content',
      header: 'Содержание',
      size: 100,
      Cell: ({ row }) => row.original.content,
    },
    {
      accessorKey: 'date_visit',
      header: 'Дата визита',
      size: 100,
      Cell: ({ row }) => formatDateDMYDT(row.original.date_visit, false, true),
    },

    {
      accessorKey: 'doctor_full_name',
      header: 'Врач',
      size: 50,
      Cell: ({ row }) => row.original.doctor_full_name,
    },
  ];

  const table = useMaterialReactTable({
    columns: columns,
    localization: MRT_Localization_RU,
    data: data,
    enableExpanding: true,
    getSubRows: (row) => row.subRows, //default
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        if (row.original.content === 'Первичный прием') {
          navigate(`/visits/${row.original.id}`);
        }
      },
      sx: {
        backgroundColor: row.getCanExpand() ? '#ccc' : 'inherit',
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
        border: '1px solid #dee2e6',
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
        <Tooltip arrow title="Добавить первичный прием">
          <IconButton
            onClick={() => {
              dispatch(setShowModalAddPrimaryVisit(true));
              dispatch(setSelectedPrimaryVisit(patient));
            }}
          >
            <PlusLg color="green" size={20} />
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
  });

  return (
    <Form className="px-3 py-2">
      <Row>
        <MaterialReactTable table={table} />
      </Row>
    </Form>
  );
};

export default PatientJournal;

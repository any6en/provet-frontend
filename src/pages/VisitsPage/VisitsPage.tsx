import { FC, useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Breadcrumb,
  Spinner,
  NavDropdown,
  Tabs,
  Tab,
} from 'react-bootstrap';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { URL_PROVET_API } from '../../config/config';
import axios from 'axios';
import TocIcon from '@mui/icons-material/Toc';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { calculateAge, formatDateDMYDT } from '../../utils/dateFormatter';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ScaleIcon from '@mui/icons-material/Scale';
import { errorHandler } from '../../utils/alarmHandler';

import style from '../PatientPage/PatientPage.module.scss';
import Visit from './Visit';
import { PlusLg } from 'react-bootstrap-icons';
import { ButtonBase, IconButton, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';

const VisitsPage: FC = () => {
  // Состояния-хранилища данных
  const [visits, setVisits] = useState<any>(null);
  const [doc, setDoc] = useState<any>(null);

  const { setShowModalAddRepeatVisit, setSelectedRepeatVisit } = userSlice.actions;

  const { primary_visit_idParam } = useParams();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    if (URL_PROVET_API) {
      axios
        .get(`${URL_PROVET_API}journal_visits?primary_visit_id=${primary_visit_idParam}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setVisits(response.data.response);
        })
        .catch((error) => {
          errorHandler(error);
        });
    }
  };

  const dispatch = useAppDispatch();
  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);
  const { setIsReloadTable } = userSlice.actions;

  // Обновляем матрицу после изменения данных роли устройства
  if (useAppSelector((state) => state.userReducer.isReloadTable)) {
    dispatch(setIsReloadTable(false));
    fetch();
  }

  // Преобразуем данные для получения нужного формата
  const steps = [];

  // Добавляем первичный прием
  steps.push({
    label: visits?.confirmed_diagnosis, // диагноз первичного приема
    description: new Date(visits?.date_visit), // время первичного приема
  });

  // Добавляем повторные визиты
  visits?.subRows.forEach((repeat_visit: any) => {
    steps.push({
      label: repeat_visit.confirmed_diagnosis, // диагноз повторного приема
      description: new Date(repeat_visit.date_visit), // время повторного приема
    });
  });

  const navigate = useNavigate();
  return (
    <Container fluid className="py-2">
      <Breadcrumb style={{ backgroundColor: '#f5f5f5' }} className="p-2">
        <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() => {
            navigate('/search_patients');
          }}
        >
          Быстрый поиск
        </Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() => {
            navigate(`/patients/${visits?.owner_id}`);
          }}
        >
          Владелец пациентов №{visits?.owner_id}
        </Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() => {
            navigate(`/patient/${visits?.patient_id}`);
          }}
        >
          Пациент №{visits?.patient_id}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          Прием(-ы) от {formatDateDMYDT(visits?.date_visit, false, true)}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Container fluid className="py-2">
        <Row className="py-1">
          <Tabs>
            <Tab
              eventKey="primary_visit"
              title={
                <span className="p-2">
                  Первичный {formatDateDMYDT(visits?.date_visit, false, true)}
                </span>
              }
            >
              <Visit visit={visits} isPrimary={true} />
            </Tab>
            {visits?.subRows?.lenght !== 0 &&
              visits?.subRows?.map((repeat_visit: any) => (
                <Tab
                  eventKey={`repeat_visit${repeat_visit.id}`}
                  title={
                    <span className="p-2">
                      Вторичный {formatDateDMYDT(repeat_visit.date_visit, false, true)}
                    </span>
                  }
                >
                  <Visit visit={repeat_visit} isPrimary={false} />
                </Tab>
              ))}
          </Tabs>
        </Row>
      </Container>
    </Container>
  );
};

export default VisitsPage;

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
import { NavLink, useParams } from 'react-router-dom';
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
import { ButtonBase } from '@mui/material';

const VisitsPage: FC = () => {
  // Состояния-хранилища данных
  const [visits, setVisits] = useState<any>(null);
  const [doc, setDoc] = useState<any>(null);

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

  // Преобразуем данные для получения нужного формата
  const steps = [];

  // Добавляем первичный прием
  steps.push({
    label: visits?.confirmed_diagnosis, // диагноз первичного приема
    description: new Date(visits?.date), // время первичного приема
  });

  // Добавляем повторные визиты
  visits?.subRows.forEach((repeat_visit: any) => {
    steps.push({
      label: repeat_visit.confirmed_diagnosis, // диагноз повторного приема
      description: new Date(repeat_visit.date), // время повторного приема
    });
  });

  return (
    <Container fluid className="py-2">
      <Breadcrumb style={{ backgroundColor: '#f5f5f5' }} className="p-2">
        <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
        <Breadcrumb.Item href={`#/patient/${visits?.patient_id}`}>
          Пациент №{visits?.patient_id}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Приемы </Breadcrumb.Item>
      </Breadcrumb>
      <Row className="py-1">
        <Col sm={2} className="d-flex justify-content-center">
          <Box>
            <Stepper orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography>123</Typography>
                    <Box sx={{ mb: 2 }}></Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Col>
        <Col sm={10}>
          <Container fluid className="pe-4">
            {' '}
            <Tabs>
              <Tab
                eventKey="primary_visit"
                title={
                  <span className="p-2">
                    Первичный {formatDateDMYDT(visits?.date, false, true)}
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
                        Вторичный {formatDateDMYDT(repeat_visit.date, false, true)}
                      </span>
                    }
                  >
                    <Visit visit={repeat_visit} isPrimary={false} />
                  </Tab>
                ))}
            </Tabs>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default VisitsPage;

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
import { Box, IconButton, Tooltip } from '@mui/material';
import ScaleIcon from '@mui/icons-material/Scale';
import { errorHandler } from '../../utils/alarmHandler';

import style from '../PatientPage/PatientPage.module.scss';
import Visit from './Visit';
import { PlusLg } from 'react-bootstrap-icons';

const VisitsPage: FC = () => {
  // Состояния-хранилища данных
  const [data, setData] = useState<any>(null);

  const [patient, setPatient] = useState<any>(null);
  const [doctors, setDoctors] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [visits, setVisits] = useState<any>(null);

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

          axios
            .get(`${URL_PROVET_API}directories/patients?id=${response.data.response.patient_id}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              setPatient(response.data.response);
            })
            .catch((error) => {
              errorHandler(error);
            });
          axios
            .get(`${URL_PROVET_API}directories/owners?id=${response.data.response.owner_id}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              setOwner(response.data.response);
            })
            .catch((error) => {
              errorHandler(error);
            });
          axios
            .get(`${URL_PROVET_API}directories/users?id=${response.data.response.user_id}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              setDoctors(response.data.response.rows);
            })
            .catch((error) => {
              errorHandler(error);
            });
        })
        .catch((error) => {
          errorHandler(error);
        });
    }
  };

  const getSrcImageIconPatient = (animal_type_id: number) => {
    if (animal_type_id === 1) {
      return 'https://cdn-icons-png.flaticon.com/512/15721/15721652.png';
    } else if (animal_type_id === 2) {
      return 'https://cdn-icons-png.flaticon.com/512/10890/10890561.png';
    }
  };

  const getFormatedFullName = (row: any) => {
    console.log(row);
    return row.last_name + ' ' + row.first_name[0] + '. ' + row.patronymic[0] + '.';
  };
  console.log(visits);

  return (
    <div>
      <Container fluid className="py-2">
        <Breadcrumb style={{ backgroundColor: '#f5f5f5' }} className="p-2">
          <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
          <Breadcrumb.Item href={`#/patient/${visits?.patient_id}`}>
            Пациент №{visits?.patient_id}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Первичный прием №{visits?.id}</Breadcrumb.Item>
        </Breadcrumb>
      </Container>
      {/* Своеобразный HEADER */}
      <Container fluid className="py-2" style={{ backgroundColor: '#f8f8f8' }}>
        <Row>
          <Col sm={2}></Col>
          <Col sm={8} className="d-flex align-items-center">
            <img
              src={getSrcImageIconPatient(patient && patient.animal_type_id)}
              className={`border border-3 align-self-center ${style.animalImage}`}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <span className="p-2" style={{ color: 'gray', fontSize: '24px' }}>
              {patient && patient.nickname}
            </span>
            <NavDropdown
              title={
                <span className="p-2">
                  <TocIcon viewBox="0 0 25 25" style={{ color: 'gray' }} />
                </span>
              }
              className={` ${style.dropdownToggle}`}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item className="border-bottom text-dark">
                <NavLink className="nav-link" aria-current="page" to="owners/">
                  <div className="d-inline-flex align-items-center justify-content-center text-dark">
                    Редактировать
                  </div>
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item className="text-dark">
                <NavLink className="nav-link" aria-current="page" to="species/">
                  <div className="d-inline-flex align-items-center justify-content-center text-dark">
                    Стать лечащим врачом
                  </div>
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item className="border-top text-dark">
                <NavLink className="nav-link" aria-current="page" to="breeds/">
                  <div className="d-inline-flex align-items-center justify-content-center text-dark">
                    Удалить
                  </div>
                </NavLink>
              </NavDropdown.Item>
            </NavDropdown>
            <span className="p-2" style={{ fontSize: '14px' }}>
              <Tooltip arrow title="Номер медкарты" placement="top">
                <span className={style.text}>№{patient && patient.id}</span>
              </Tooltip>
            </span>
            <span className="p-2">
              <Tooltip arrow title="Возраст" placement="top">
                <span
                  className={style.text}
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <CalendarTodayIcon viewBox="0 0 25 25" style={{ color: 'gray' }} />
                  &nbsp;
                  {calculateAge(patient && patient.date_birth)}
                </span>
              </Tooltip>
            </span>
            <span className="p-2">
              <Tooltip arrow title="Вес" placement="top">
                <span
                  className={style.text}
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <ScaleIcon viewBox="0 0 25 25" style={{ color: 'gray' }} />
                  &nbsp; 700&nbsp;г.
                </span>
              </Tooltip>
            </span>
          </Col>
        </Row>
      </Container>
      <Container className="py-2">
        <Tabs>
          <Tab
            eventKey="primary_visit"
            title={<span className="p-2">{formatDateDMYDT(visits?.date, false, true)}</span>}
          >
            <Visit patient={patient} owner={owner} visit={visits} doctors={doctors} />
          </Tab>
          {visits?.subRows?.lenght !== 0 &&
            visits?.subRows?.map((repeat_visit: any) => (
              <Tab
                eventKey={`repeat_visit${repeat_visit.id}`}
                title={
                  <span className="p-2">{formatDateDMYDT(repeat_visit.date, false, true)}</span>
                }
              >
                <Visit patient={patient} owner={owner} visit={repeat_visit} doctors={doctors} />
              </Tab>
            ))}
        </Tabs>
      </Container>
    </div>
  );
};

export default VisitsPage;

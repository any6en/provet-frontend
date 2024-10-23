import { FC, useEffect, useState } from 'react';
import { Modal, Button, Form, Container, Row, Col, Breadcrumb, Spinner } from 'react-bootstrap';
import { NavLink, useParams } from 'react-router-dom';
import { URL_PROVET_API } from '../../config/config';
import axios from 'axios';
import TocIcon from '@mui/icons-material/Toc';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { calculateAge } from '../../utils/dateFormatter';
import { Tooltip } from '@mui/material';
import ScaleIcon from '@mui/icons-material/Scale';
import { errorHandler } from '../../utils/alarmHandler';

import style from '../PatientPage/PatientPage.module.scss';

const PrimaryVisitPage: FC = () => {
  // Состояния-хранилища данных
  const [data, setData] = useState<any>(null);

  const [patient, setPatient] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [owner, setOwner] = useState<any>(null);
  const [visit, setVisit] = useState<any>(null);

  const { primary_visit_idParam } = useParams();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    if (URL_PROVET_API) {
      axios
        .get(`${URL_PROVET_API}directories/primary_visits?id=${primary_visit_idParam}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setVisit(response.data.response);

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
            .get(`${URL_PROVET_API}directories/users`, {
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

  return (
    <div>
      <Container fluid className="py-2">
        <Breadcrumb style={{ backgroundColor: '#f5f5f5' }} className="p-2">
          <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
          <Breadcrumb.Item href="/">Пациент №1</Breadcrumb.Item>
          <Breadcrumb.Item active>Первичный прием №1</Breadcrumb.Item>
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
        Внимание! Внимательно: поля врач, владелец, пациент, дата посещения выставляется
        АВТОМАТИЧЕСКИ!
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3" as={Row}>
                <Form.Label className="fs-6" column sm={4}>
                  Врач
                </Form.Label>
                <Col sm={3} className="d-flex align-items-center justify-content-center">
                  {doctors.length !== 0 ? (
                    <Form.Select
                      aria-label="select"
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          user_id: Number(e.target.value),
                        });
                      }}
                    >
                      <option value="" selected disabled>
                        Выберите врача
                      </option>
                      {doctors.map((obj) => {
                        if (visit?.user_id !== obj.id) {
                          return (
                            <option key={obj.id} value={obj.id}>
                              {getFormatedFullName(obj)}
                            </option>
                          );
                        } else {
                          return (
                            <option key={obj.id} value={obj.id} selected>
                              {getFormatedFullName(obj)}
                            </option>
                          );
                        }
                      })}
                    </Form.Select>
                  ) : (
                    <Spinner variant="primary" size="sm" />
                  )}
                </Col>
              </Form.Group>

              <Form.Group className="mb-3" as={Row}>
                <Form.Label className="fs-6" column sm={4}>
                  Владелец
                </Form.Label>
                <Col sm={3} className="d-flex align-items-center justify-content-center">
                  <Form.Control aria-label="text" value={owner?.first_name} size="sm" readOnly />
                </Col>
              </Form.Group>

              <Form.Group className="mb-3" as={Row}>
                <Form.Label className="fs-6" column sm={4}>
                  Пациент
                </Form.Label>
                <Col sm={3} className="d-flex align-items-center justify-content-center">
                  <Form.Control aria-label="text" value={patient?.nickname} size="sm" readOnly />
                </Col>
              </Form.Group>

              <Form.Group className="mb-3" as={Row}>
                <Form.Label className="fs-6" column sm={4}>
                  Дата возникновения болезни
                </Form.Label>
                <Col sm={3} className="d-flex align-items-center justify-content-center">
                  <Form.Control
                    type="date"
                    value={visit?.disease_onset_date && visit.disease_onset_date.substring(0, 10)}
                  />
                </Col>
              </Form.Group>

              <Form.Group>
                <Form.Label>Анамнез</Form.Label>
                <Form.Control as="textarea" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Обследование</Form.Label>
                <Form.Control as="textarea" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Предварительный диагноз</Form.Label>
                <Form.Control as="textarea" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Подтвержденный диагноз</Form.Label>
                <Form.Control as="textarea" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Результат</Form.Label>
                <Form.Control as="textarea" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Дата посещения</Form.Label>
                <Form.Control type="datetime-local" />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit">Добавить посещение</Button>
        </Form>
      </Container>
    </div>
  );
};

export default PrimaryVisitPage;

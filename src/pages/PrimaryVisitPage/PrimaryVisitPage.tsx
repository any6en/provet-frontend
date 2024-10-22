import { FC, useEffect, useState } from 'react';
import { Modal, Button, Form, Container, Row, Col, Breadcrumb } from 'react-bootstrap';
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
  const [patient, setPatient] = useState<any>(null);
  const [visit, setVisit] = useState<any>(null);

  const fetch = async () => {
    if (URL_PROVET_API) {
      axios
        .get(`${URL_PROVET_API}directories/patients?id=1`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setPatient(response.data.response);
        })
        .catch(() => {})
        .finally(() => {});

      axios
        .get(`${URL_PROVET_API}primary_visits?id=1`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setVisit(response.data.response);
        })
        .catch((error) => {
          errorHandler(error);
        })
        .finally(() => {});
    }
  };

  const getSrcImageIconPatient = (animal_type_id: number) => {
    if (animal_type_id === 1) {
      return 'https://cdn-icons-png.flaticon.com/512/15721/15721652.png';
    } else if (animal_type_id === 2) {
      return 'https://cdn-icons-png.flaticon.com/512/10890/10890561.png';
    }
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
              <Form.Group>
                <Form.Label>Врач</Form.Label>
                <Form.Control as="select">
                  <option value="">Выберите врача</option>
                  {/* Выбор врача */}
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Владелец пациента</Form.Label>
                <Form.Control as="select">
                  <option value="">Выберите владельца</option>
                  {/* Выбор владельца */}
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Пациент</Form.Label>
                <Form.Control as="select">
                  <option value="">Выберите пациента</option>
                  {/* Выбор пациента */}
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Дата возникновения болезни</Form.Label>
                <Form.Control type="date" />
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

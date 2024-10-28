import { useEffect, useState } from 'react';
import style from './PatientPage.module.scss';
import { Breadcrumb, Col, Container, NavDropdown, Row, Tab, Tabs } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { URL_PROVET_API } from '../../config/config';
import axios from 'axios';
import TocIcon from '@mui/icons-material/Toc';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { calculateAge } from '../../utils/dateFormatter';
import { Tooltip } from '@mui/material';
import ScaleIcon from '@mui/icons-material/Scale';
import PatientJournal from './components/PatientJournal';

const PatientPage = () => {
  const { patient_idParam } = useParams();

  const [patient, setPatient] = useState<any>(null);

  const location = useLocation();

  const activeTab = location.hash.split('#')[1];

  const fetchPatient = async () => {
    if (URL_PROVET_API) {
      axios
        .get(`${URL_PROVET_API}directories/patients?id=${patient_idParam}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setPatient(response.data.response);
        })
        .catch(() => {})
        .finally(() => {});
    }
  };

  useEffect(() => {
    fetchPatient();
  }, []);

  const getSrcImageIconPatient = (animal_type_id: number) => {
    if (animal_type_id === 1) {
      return 'https://cdn-icons-png.flaticon.com/512/15721/15721652.png';
    } else if (animal_type_id === 2) {
      return 'https://cdn-icons-png.flaticon.com/512/10890/10890561.png';
    }
  };

  const handleSelectTab = (e: any) => {
    navigate(`${location.pathname}#${e}`);
  };

  const navigate = useNavigate();
  return (
    <div>
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
              navigate(`/patients/${patient?.owner_id}`);
            }}
          >
            Владелец пациентов №{patient?.owner_id}
          </Breadcrumb.Item>

          <Breadcrumb.Item active>Пациент №{patient_idParam}</Breadcrumb.Item>
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
          </Col>
        </Row>
      </Container>
      <Container className="py-2">
        <Tabs defaultActiveKey={activeTab} onSelect={handleSelectTab}>
          {/* Вкладка журнал */}
          <Tab eventKey="journal" title={<span className="p-2">Журнал</span>}>
            <PatientJournal patient={patient} />
          </Tab>
          {/* Вкладка Свойства */}
          <Tab eventKey="props" title={<span className="p-2">Свойства</span>}>
            Свойства
          </Tab>
          {/* Вкладка Направления */}
          <Tab eventKey="directions" title={<span className="p-2">Направления</span>}>
            sssssssssss
          </Tab>
          {/* Вкладка Диагнозы */}
          <Tab
            onSelect={(e) => {
              handleSelectTab(e);
            }}
            eventKey="diagnoses"
            title={<span className="p-2">Диагнозы</span>}
          >
            sssssssssss
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default PatientPage;

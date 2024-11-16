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
import PatientJournal from './components/Journal/PatientJournal';
import Properties from './components/Properties/Properties';
import Swal from 'sweetalert2';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';
import { useAppDispatch } from '../../hooks/redux';

const PatientPage = () => {
  const { patient_idParam } = useParams();

  const [patient, setPatient] = useState<any>(null);

  const location = useLocation();

  const activeTab = location.hash.split('#')[1];

  const dispatch = useAppDispatch();

  const { setShowModalChangePatient, setSelectedPatient } = userSlice.actions;

  const fetch = async () => {
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
  };

  // При монтировании компонента
  useEffect(() => {
    fetch();
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
    <>
      <p className="py-2">
        <Breadcrumb className="p-1 ps-2">
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
      </p>

      {/* Своеобразный HEADER */}
      <Container
        fluid
        className="py-2"
        style={{
          border: '1px solid #dee2e6',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Row>
          <Col sm={1}></Col>
          <Col sm={11} className="d-flex align-items-center">
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
              <NavDropdown.Item
                className="border-bottom text-dark"
                onClick={() => {
                  const patientlol = {
                    id: patient.id,
                    owner_id: patient.owner_id,
                    nickname: patient.nickname,
                    breed_id: patient.breed_id,
                    animal_type_id: patient.animal_type_id,
                    date_birth: patient.date_birth,
                    gender: patient.gender,
                    created_at: patient.created_at,
                  };

                  dispatch(setSelectedPatient(patientlol));
                  dispatch(setShowModalChangePatient(true));
                }}
              >
                <NavLink className="nav-link" aria-current="page" to="">
                  <div className="d-inline-flex align-items-center justify-content-center text-dark">
                    Редактировать
                  </div>
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item
                className="border-top text-dark"
                onClick={() => {
                  Swal.fire({
                    title: 'Вы уверены?',
                    text: 'При удалении пациента удалятся все связные данные: первичные, повторны визиты, вакцинации',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Да',
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      try {
                        await axios.delete(
                          `${URL_PROVET_API}directories/patients/patient/${patient.patient_id}`,
                          {
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          },
                        );

                        Swal.fire({
                          title: 'Успешно!',
                          text: 'Запись была удалена',
                          icon: 'success',
                        });
                        navigate('patients/' + patient.owner_id);
                      } catch (error) {
                        Swal.fire({
                          title: 'Провал!',
                          text: 'Что-то пошло не так',
                          icon: 'error',
                        });
                      }
                    }
                  });
                }}
              >
                <NavLink className="nav-link" aria-current="page" to="">
                  <div className="d-inline-flex align-items-center justify-content-center text-dark">
                    Удалить
                  </div>
                </NavLink>
              </NavDropdown.Item>
            </NavDropdown>

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
      <Container className="py-4">
        <Tabs defaultActiveKey={activeTab} onSelect={handleSelectTab}>
          {/* Вкладка журнал */}
          <Tab eventKey="journal" title={<span className="p-2">Журнал</span>}>
            <PatientJournal patient={patient} />
          </Tab>
          {/* Вкладка Свойства */}
          <Tab eventKey="props" title={<span className="p-2">Свойства</span>}>
            <Properties patient={patient} />
          </Tab>
          {/* Вкладка Направления */}
          <Tab eventKey="directions" title={<span className="p-2">Направления</span>}>
            sssssssssss
          </Tab>
          {/* Вкладка Диагнозы */}
          <Tab eventKey="diagnoses" title={<span className="p-2">Диагнозы</span>}>
            sssssssssss
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default PatientPage;

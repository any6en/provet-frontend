import { FC, useEffect, useState } from 'react';
import { Container, Row, Col, Breadcrumb, NavDropdown, Tabs, Tab } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { URL_PROVET_API } from '../../config/config';
import axios from 'axios';
import TocIcon from '@mui/icons-material/Toc';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { formatDateDMYDT } from '../../utils/dateFormatter';
import { errorHandler } from '../../utils/alarmHandler';
import style from '../PatientPage/PatientPage.module.scss';
import Visit from './components/Visit';
import { Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';

const VisitsPage: FC = () => {
  // Состояния-хранилища данных
  const [visits, setVisits] = useState<any>(null);
  const { primary_visit_idParam } = useParams();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
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
  };

  const dispatch = useAppDispatch();
  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);
  const { setIsReloadTable } = userSlice.actions;

  // Обновляем матрицу после изменения данных роли устройства
  if (isReloadTable) {
    dispatch(setIsReloadTable(false));
    fetch();
  }

  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.hash.split('#')[1] || `primary_visit_${visits?.id}`; // Устанавливаем активную вкладку по умолчанию

  const handleSelectTab = (e: any) => {
    navigate(`${location.pathname}#${e}`);
  };

  const getSrcImageIconPatient = (animal_type_id: number) => {
    if (animal_type_id === 1) {
      return 'https://cdn-icons-png.flaticon.com/512/15721/15721652.png';
    } else if (animal_type_id === 2) {
      return 'https://cdn-icons-png.flaticon.com/512/10890/10890561.png';
    }
  };

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
      {/* Своеобразный HEADER */}
      <Container fluid className="py-2" style={{ backgroundColor: '#f8f8f8' }}>
        <Row>
          <Col sm={2}></Col>
          <Col sm={8} className="d-flex align-items-center">
            <img
              src={getSrcImageIconPatient(visits?.animal_type_id)}
              className={`border border-3 align-self-center ${style.animalImage}`}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <span className="p-2" style={{ color: 'gray', fontSize: '24px' }}>
              {visits?.nickname}
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
                <span className={style.text}>№{visits?.patient_id}</span>
              </Tooltip>
            </span>
            <span className="p-2">
              <Tooltip arrow title="Возраст на данный момент времени" placement="top">
                <span
                  className={style.text}
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <CalendarTodayIcon viewBox="0 0 25 25" style={{ color: 'gray' }} />
                  <span className="ps-2">{visits?.now_age}</span>
                </span>
              </Tooltip>
            </span>
          </Col>
        </Row>
      </Container>
      <Container className="py-2">
        <Row className="py-1">
          <Tabs activeKey={activeTab} onSelect={handleSelectTab}>
            <Tab
              eventKey={`primary_visit_${visits?.id}`}
              title={
                <span className="p-2">
                  Первичный {formatDateDMYDT(visits?.date_visit, false, true)}
                </span>
              }
            >
              <Visit visit={visits} isPrimary={true} />
            </Tab>
            {visits?.subRows?.length > 0 && // Исправлено на length
              visits.subRows.map((repeat_visit: any) => (
                <Tab
                  key={`repeat_visit_${repeat_visit.id}`} // Добавлен ключ
                  eventKey={`repeat_visit_${repeat_visit.id}`}
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

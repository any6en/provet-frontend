import React from 'react';
import { Col, Row, NavDropdown, Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import TocIcon from '@mui/icons-material/Toc';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { userSlice } from '../../../store/reducers/UserSlice/UserSlice';
import style from '../../PatientPage/PatientPage.module.scss';
import { calculateAge } from '../../../utils/dateFormatter';

interface PatientHeaderProps {
  patient: any;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  const dispatch = useDispatch();
  const { setShowModalChangePatient, setSelectedPatient } = userSlice.actions;

  const handleEditPatient = () => {
    dispatch(setSelectedPatient(patient));
    dispatch(setShowModalChangePatient(true));
  };

  const handleDeletePatient = () => {
    Swal.fire({
      title: 'Вы уверены?',
      text: 'При удалении пациента удалятся все связные данные: первичные, повторные визиты, вакцинации',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да',
    }).then(async (result) => {
      if (result.isConfirmed) {
      }
    });
  };

  const getSrcImageIconPatient = (animal_type_id: number) => {
    if (animal_type_id === 1) {
      return 'https://cdn-icons-png.flaticon.com/512/15721/15721652.png';
    } else if (animal_type_id === 2) {
      return 'https://cdn-icons-png.flaticon.com/512/10890/10890561.png';
    }
  };

  return (
    <Container
      fluid
      className="py-2"
      style={{ backgroundColor: '#f8f8f8', borderRadius: '25px', border: '1px solid #dee2e6' }}
    >
      <Row>
        <Col sm={2}></Col>
        <Col sm={8} className="d-flex align-items-center">
          <img
            alt="Изображение животного"
            src={getSrcImageIconPatient(patient?.animal_type_id)}
            className={`border border-3 align-self-center ${style.animalImage}`}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <span className="p-2" style={{ color: 'gray', fontSize: '24px' }}>
            {patient?.nickname}
          </span>
          <NavDropdown
            title={<TocIcon viewBox="0 0 25 25" style={{ color: 'gray' }} />}
            className={` ${style.dropdownToggle}`}
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item className="border-bottom text-dark" onClick={handleEditPatient}>
              <NavLink className="nav-link" aria-current="page" to="">
                <div className="d-inline-flex align-items-center justify-content-center text-dark">
                  Редактировать
                </div>
              </NavLink>
            </NavDropdown.Item>
            <NavDropdown.Item className="border-top text-dark" onClick={handleDeletePatient}>
              <NavLink className="nav-link" aria-current="page" to="">
                <div className="d-inline-flex align-items-center justify-content-center text-dark">
                  Удалить
                </div>
              </NavLink>
            </NavDropdown.Item>
          </NavDropdown>
          <span className="p-2" style={{ fontSize: '14px' }}>
            <Tooltip arrow title="Номер медкарты" placement="top">
              <span className={style.text}>№{patient?.patient_id}</span>
            </Tooltip>
          </span>
          <span className="p-2">
            <Tooltip arrow title="Возраст на данный момент времени" placement="top">
              <span className={style.text} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <CalendarTodayIcon viewBox="0 0 25 25" style={{ color: 'gray' }} />
                <span className="ps-2">{calculateAge(patient?.date_birth)}</span>
              </span>
            </Tooltip>
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientHeader;

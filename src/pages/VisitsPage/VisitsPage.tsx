// VisitsPage.tsx
import React, { FC, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { URL_PROVET_API } from '../../config/config';
import VisitCard from './components/VisitCard';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';
import { errorHandler } from '../../utils/alarmHandler';
import BreadcrumbsLoL from './components/BreadcrumbsLoL';
import VisitTabs from './components/VisitTabs';
import PatientHeader from './components/PatientHeader';

const VisitsPage: FC = () => {
  const [visits, setVisits] = useState<any>(null);
  const { primary_visit_idParam } = useParams();
  const dispatch = useAppDispatch();
  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);
  const [value, setValue] = useState(0);

  const fetchVisits = async () => {
    try {
      const response = await axios.get(
        `${URL_PROVET_API}journal_visits?primary_visit_id=${primary_visit_idParam}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setVisits(response.data.response);
    } catch (error) {}
  };

  useEffect(() => {
    fetchVisits();
  }, [primary_visit_idParam]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
      <BreadcrumbsLoL visits={visits} />
      <Row>
        <Col sm={2}>
          <VisitTabs visits={visits} value={value} handleChange={handleChange} />
        </Col>
        <Col sm={10}>
          <PatientHeader visits={visits} getSrcImageIconPatient={getSrcImageIconPatient} />
          <VisitCard visits={visits} value={value} />
        </Col>
      </Row>
    </Container>
  );
};

export default VisitsPage;

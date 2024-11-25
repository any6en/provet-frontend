import React, { FC, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VisitCard from './components/VisitCard';
import Breadcrumbs from './components/Breadcrumbs';
import VisitTabs from './components/VisitTabs';
import PatientHeader from './components/PatientHeader';
import config from '../../config/config';

const VisitsPage: FC = () => {
  const [visits, setVisits] = useState<any>(null);
  const { primary_visit_idParam } = useParams();
  const [value, setValue] = useState(0);

  const fetchVisits = () => {
    if (config.url_provet_api) {
      axios
        .get(`${config.url_provet_api}journal_visits?primary_visit_id=${primary_visit_idParam}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setVisits(response.data.response);
        });
    }
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
    <Container fluid className="py-2" style={{ backgroundColor: '#ECECEC' }}>
      <Breadcrumbs visits={visits} />
      <Row>
        <Col sm={2}>
          <VisitTabs visits={visits} value={value} handleChange={handleChange} />
        </Col>
        <Col sm={10}>
          <PatientHeader visits={visits} />
          <span className="p-2"></span>
          <VisitCard visits={visits} value={value} />
        </Col>
      </Row>
    </Container>
  );
};

export default VisitsPage;

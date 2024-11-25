import { useEffect, useState } from 'react';
import { Breadcrumb, Container, NavDropdown, Row, Tab, Tabs } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Journal from './components/Journal/Journal';
import Properties from './components/Properties/Properties';
import PatientHeader from './components/PatientHeader';
import Breadcrumbs from './components/Breadcrumbs';
import config from '../../config/config';

const PatientPage = () => {
  const { patient_idParam } = useParams();

  const [patient, setPatient] = useState<any>(null);

  const location = useLocation();

  const activeTab = location.hash.split('#')[1];

  const fetch = async () => {
    if (config.url_provet_api) {
      axios
        .get(`${config.url_provet_api}directories/patients?id=${patient_idParam}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setPatient(response.data.response);
        });
    }
  };

  // При монтировании компонента
  useEffect(() => {
    fetch();
  }, []);

  const handleSelectTab = (e: any) => {
    navigate(`${location.pathname}#${e}`);
  };

  const navigate = useNavigate();
  return (
    <>
      <Container fluid className="py-2" style={{ backgroundColor: '#ECECEC' }}>
        <Breadcrumbs patient={patient} />
        <PatientHeader patient={patient} />
        <span className="p-2"></span>
        <Container
          style={{
            borderRadius: '25px',
            border: '1px solid #dee2e6',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
          className="p-0"
        >
          <div style={{ border: 'none' }}>
            <div
              style={{
                backgroundColor: '#cfe2ff',
                fontWeight: 'bold',
                textAlign: 'center',
                border: 'none',
              }}
            >
              <h5 className="p-2">Общая информация о пациенте</h5>
            </div>
            <div style={{ borderRadius: '0 0 25px 25px', padding: '20px' }}>
              <Tabs defaultActiveKey={activeTab} onSelect={handleSelectTab}>
                {/* Вкладка журнал */}
                <Tab eventKey="journal" title={<span className="p-2">Журнал</span>}>
                  <Journal patient={patient} />
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
            </div>
          </div>
        </Container>
      </Container>
    </>
  );
};

export default PatientPage;

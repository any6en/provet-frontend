import { FC, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { IPatient } from '../Directories/PatientsPage/IPatients';
import axios from 'axios';
import Breadcrumbs from './components/Breadcrumbs';
import Table from './components/Table/Table';
import config from '../../config/config';

const OwnerPatientsPage: FC = () => {
  const dispatch = useAppDispatch();
  const { owner_idParam } = useParams();
  const controller = useRef(new AbortController());
  const [patients, setPatients] = useState<IPatient[]>([]);

  const [isLoadMatrix, setLoadMatrix] = useState<boolean>(true);

  const { setIsReloadTable } = userSlice.actions;

  const fetch = async () => {
    setIsReloadTable(true);
    setLoadMatrix(true);

    if (config.url_provet_api) {
      axios
        .get(`${config.url_provet_api}directories/patients?owner_id=${owner_idParam}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setPatients(response.data.response.rows);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsReloadTable(false);
          setLoadMatrix(false);
        });
    }
  };

  if (useAppSelector((state) => state.userReducer.isReloadTable)) {
    dispatch(setIsReloadTable(false));
    fetch();
  }

  useEffect(() => {
    controller.current = new AbortController();

    fetch();

    return () => {
      controller.current.abort();
    };
  }, []);

  return (
    <>
      {owner_idParam ? (
        <Container fluid className="py-2" style={{ backgroundColor: '#ECECEC' }}>
          <Breadcrumbs ownerId={owner_idParam} isLoadMatrix={isLoadMatrix} />
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
                <h5 className="p-2">Справочник пациентов владельца</h5>
              </div>
              <div style={{ borderRadius: '0 0 25px 25px', padding: '20px' }}>
                <Table patients={patients} isLoadMatrix={isLoadMatrix} />
              </div>
            </div>
          </Container>
        </Container>
      ) : (
        <Container fluid>Ошибка в запросе</Container>
      )}
    </>
  );
};

export default OwnerPatientsPage;

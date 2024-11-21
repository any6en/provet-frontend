import { FC, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { IPatient } from '../Directories/PatientsPage/IPatients';
import axios from 'axios';
import { URL_PROVET_API } from '../../config/config';
import Swal from 'sweetalert2';
import Breadcrumbs from './components/Breadcrumbs';
import Table from './components/Table';

const OwnerPatientsPage: FC = () => {
  const dispatch = useAppDispatch();
  const { owner_idParam } = useParams();
  const controller = useRef(new AbortController());
  const [patients, setPatients] = useState<IPatient[]>([]);

  const { setIsReloadTable, setShowModalAddPatient } = userSlice.actions;

  const fetchPatients = async () => {
    setIsReloadTable(true);
    try {
      const response = await axios.get(
        `${URL_PROVET_API}directories/patients?owner_id=${owner_idParam}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setPatients(response.data.response.rows);
    } catch (error) {
      console.error(error);
    } finally {
      setIsReloadTable(false);
    }
  };

  useEffect(() => {
    controller.current = new AbortController();
    fetchPatients();

    return () => {
      controller.current.abort();
    };
  }, []);

  const handleDeletePatient = async (patientId: number) => {
    const result = await Swal.fire({
      title: 'Вы уверены?',
      text: 'Отменить удаление нельзя...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${URL_PROVET_API}directories/patients/patient/${patientId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== patientId));
        Swal.fire('Успешно!', 'Запись была удалена', 'success');
      } catch (error) {
        Swal.fire('Провал!', 'Что-то пошло не так', 'error');
      }
    }
  };

  return (
    <>
      {owner_idParam ? (
        <Container fluid className="py-2" style={{ backgroundColor: '#ECECEC' }}>
          <Breadcrumbs ownerId={owner_idParam} />
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
                <Table
                  patients={patients}
                  fetchPatients={fetchPatients}
                  handleDeletePatient={handleDeletePatient}
                  dispatch={dispatch}
                />
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

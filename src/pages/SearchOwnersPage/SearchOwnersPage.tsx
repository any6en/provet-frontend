import { FC, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';
import Table from './components/Table/Table';
import Breadcrumbs from './components/Breadcrumbs';
import { IOwner } from '../../store/reducers/UserSlice/UserSliceTypes';
import Swal from 'sweetalert2';
import config from '../../config/config';

const SearchOwnersPage: FC = () => {
  const dispatch = useAppDispatch();
  const [owners, setOwners] = useState<IOwner[]>([]);
  const [isLoadMatrix, setLoadMatrix] = useState<boolean>(true);
  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);
  const { setIsReloadTable } = userSlice.actions;

  const fetch = () => {
    setIsReloadTable(true);
    setLoadMatrix(true);

    if (config.url_provet_api) {
      axios
        .get(`${config.url_provet_api}directories/owners`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setOwners(response.data.response.rows);
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

  useEffect(() => {
    fetch();
  }, []);

  if (isReloadTable) {
    dispatch(setIsReloadTable(false));
    fetch();
  }

  const handleDeleteOwner = (ownerId: number) => {
    Swal.fire({
      title: 'Вы уверены?',
      text: 'Удаление записи владельца приведет к удалению ...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да',
    }).then((result) => {
      if (result.isConfirmed) {
        if (config.url_provet_api) {
          axios
            .delete(`${config.url_provet_api}directories/owners/owner/${ownerId}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then(() => {
              // Обновите состояние владельцев
              setOwners((prevOwners) => prevOwners.filter((owner) => owner.id !== ownerId));
              Swal.fire('Успешно!', 'Запись была удалена', 'success');
            })
            .catch(() => {
              Swal.fire('Провал!', 'Что-то пошло не так', 'error');
            });
        }
      }
    });
  };

  return (
    <>
      <Container fluid className="py-2" style={{ backgroundColor: '#ECECEC' }}>
        <Breadcrumbs isLoadMatrix={isLoadMatrix} />
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
              <h5 className="p-2">Справочник владельцов</h5>
            </div>
            <div style={{ borderRadius: '0 0 25px 25px', padding: '20px' }}>
              <p>Выберите в матрице нужного владельца</p>
              <Table owners={owners} isLoadMatrix={isLoadMatrix} />
            </div>
          </div>
        </Container>
      </Container>
    </>
  );
};

export default SearchOwnersPage;

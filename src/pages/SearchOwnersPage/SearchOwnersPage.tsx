import { FC, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { URL_PROVET_API } from '../../config/config';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';
import Table from './components/Table/Table';
import Breadcrumbs from './components/Breadcrumbs';
import { IOwner } from '../../store/reducers/UserSlice/UserSliceTypes';
import Swal from 'sweetalert2';

const SearchOwnersPage: FC = () => {
  const dispatch = useAppDispatch();
  const [owners, setOwners] = useState<IOwner[]>([]);
  const [isLoadMatrix, setLoadMatrix] = useState<boolean>(true);
  const isReloadTable = useAppSelector((state) => state.userReducer.isReloadTable);
  const { setIsReloadTable } = userSlice.actions;

  const fetch = async () => {
    setIsReloadTable(true);
    setLoadMatrix(true);
    try {
      const response = await axios.get(`${URL_PROVET_API}directories/owners`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setOwners(response.data.response.rows);
    } catch (error) {
      console.error(error);
    } finally {
      setIsReloadTable(false);
      setLoadMatrix(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (isReloadTable) {
    dispatch(setIsReloadTable(false));
    fetch();
  }

  const handleDeleteOwner = async (ownerId: number) => {
    const result = await Swal.fire({
      title: 'Вы уверены?',
      text: 'Удаление записи владельца приведет к удалению ...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${URL_PROVET_API}directories/owners/owner/${ownerId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setOwners((prevOwners) => prevOwners.filter((owner) => owner.id !== ownerId));
        Swal.fire('Успешно!', 'Запись была удалена', 'success');
      } catch (error) {
        Swal.fire('Провал!', 'Что-то пошло не так', 'error');
      }
    }
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

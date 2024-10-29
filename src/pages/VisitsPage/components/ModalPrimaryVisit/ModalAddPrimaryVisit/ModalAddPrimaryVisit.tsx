import { FC, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { URL_PROVET_API } from '../../../../../config/config';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { userSlice } from '../../../../../store/reducers/UserSlice/UserSlice';
import { IAnimalType } from '../../../../../store/reducers/UserSlice/UserSliceTypes';
import AutoResizeTextarea from '../../../../../components/AutoResizeTextarea/AutoResizeTextarea';

const ModalAddPrimaryVisit: FC = () => {
  // Флаг, открыта ли форма
  const show = useAppSelector((state) => state.userReducer.modalAddPrimaryVisit);
  const { setShowModalAddPrimaryVisit, setIsReloadTable } = userSlice.actions;

  // Выбранная запись. Не подлежит редактированию!
  const selectedData = useAppSelector((state) => state.userReducer.selectedPrimaryVisit);

  const user = useAppSelector((state) => state.globalUserReducer.globalUser);

  const dispatch = useAppDispatch();

  // Состояние для хранения измененных данных в форме
  const [data, setData] = useState<any>({});
  const [users, setUsers] = useState<any>([]);

  // Состояние, характерное для загрузки
  const [isPreload, setIsPreload] = useState<boolean>(false);
  const fetch = async () => {
    setIsPreload(true);

    axios
      .get(`${URL_PROVET_API}directories/users`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setUsers(response.data.response.rows);
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => {
        setIsPreload(false);
      });
  };

  // Обработчик монтирования компонента
  useEffect(() => {
    if (show) {
      //controller.current = new AbortController();

      // Получаем текущую дату в UTC
      const now = new Date();

      // Преобразуем дату в пермское время (UTC+5)
      const permTimeOffset = 5 * 60 * 60 * 1000; // смещение в миллисекундах
      const permTime = new Date(now.getTime() + permTimeOffset);

      // Форматируем дату как строку в формате YYYY-MM-DDTHH:mm
      const formattedDate = permTime.toISOString().substring(0, 16);

      const patient_id = selectedData.id;
      const {
        created_at,
        date_birth,
        gender,
        nickname,
        animal_type_id,
        animal_type_name,
        breed_name,
        ...remainingData
      } = selectedData;

      setData({
        ...remainingData,
        date_visit: formattedDate,
        user_id: user.id,
        patient_id: patient_id,
      });

      fetch();
    }
  }, [show]);

  const handleUpdate = async () => {
    setIsPreload(true);

    axios
      .post(`${URL_PROVET_API}directories/primary_visits/primary_visit`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        dispatch(setIsReloadTable(true));
        successHandler('Запись добавлена');

        handleClose();
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => {
        setIsPreload(false);
      });
  };

  // Очистка формы
  const cleanForm = () => {
    setData({});
    setIsPreload(false);
  };

  const handleClose = (): void => {
    dispatch(setShowModalAddPrimaryVisit(false));

    // При закрытии обрыв всех запросов
    //controller.current.abort();
    cleanForm();
  };

  return (
    <Modal
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleClose}
    >
      <Modal.Header className="justify-content-center">
        <Modal.Title className="fs-6">{`Добавление первичного приема`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1 pb-1">
        <Container fluid>
          <Row>
            <Col className="ps-0">
              <Form id="formModal">
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Врач
                  </Form.Label>
                  <Col sm={8}>
                    {users.length !== 0 ? (
                      <Form.Select
                        aria-label="select"
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            user_id: Number(e.target.value),
                          });
                        }}
                      >
                        <option value="" selected={user?.firstName === ''}>
                          Выберите врача
                        </option>
                        {users.map((obj: any) => {
                          if (user?.id !== obj.id) {
                            return (
                              <option key={obj.id} value={obj.id}>
                                {obj.last_name +
                                  ' ' +
                                  obj.first_name[0] +
                                  '. ' +
                                  obj.patronymic[0] +
                                  '.'}
                              </option>
                            );
                          } else {
                            return (
                              <option key={obj.id} value={obj.id} selected>
                                {obj.last_name +
                                  ' ' +
                                  obj.first_name[0] +
                                  '. ' +
                                  obj.patronymic[0] +
                                  '.'}
                              </option>
                            );
                          }
                        })}
                      </Form.Select>
                    ) : (
                      <Spinner variant="primary" />
                    )}
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Вес
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          weight: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Дата возникновения болезни
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="date"
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          disease_onset_date: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Анамнез
                  </Form.Label>
                  <Col sm={8}>
                    <AutoResizeTextarea
                      value={data?.anamnesis}
                      onChange={(e: any) => {
                        setData({ ...data, anamnesis: e.target.value });
                      }}
                    />
                  </Col>
                </Form.Group>

                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Обследование
                  </Form.Label>
                  <Col sm={8}>
                    <AutoResizeTextarea
                      value={data?.examination}
                      onChange={(e: any) => {
                        setData({ ...data, examination: e.target.value });
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Предварительный диагноз
                  </Form.Label>
                  <Col sm={8}>
                    <AutoResizeTextarea
                      value={data?.prelim_diagnosis}
                      onChange={(e: any) => {
                        setData({ ...data, prelim_diagnosis: e.target.value });
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Подтвержденный диагноз
                  </Form.Label>
                  <Col sm={8}>
                    <AutoResizeTextarea
                      value={data?.confirmed_diagnosis}
                      onChange={(e: any) => {
                        setData({ ...data, confirmed_diagnosis: e.target.value });
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Назначение
                  </Form.Label>
                  <Col sm={8}>
                    <AutoResizeTextarea
                      value={data?.result}
                      onChange={(e: any) => {
                        setData({ ...data, result: e.target.value });
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Дата визита
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="date"
                      value={data?.date_visit && data.date_visit.substring(0, 10)}
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          date_visit: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Row className="w-100">
          <Col sm={4}></Col>
          <Col sm={8} className="d-flex align-items-center justify-content-end ">
            <Button
              variant="primary"
              onClick={handleUpdate}
              disabled={false}
              className="px-0 sendFormAddDataButton"
            >
              <div className="d-flex align-items-center justify-content-center">
                Добавить&nbsp;
                {isPreload && <Spinner size="sm" style={{ color: '#fff' }} />}
              </div>
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddPrimaryVisit;
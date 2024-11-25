import { FC, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import { errorHandler, successHandler } from '../../../../../utils/alarmHandler';
import { userSlice } from '../../../../../store/reducers/UserSlice/UserSlice';
import AutoResizeTextarea from '../../../../../components/AutoResizeTextarea/AutoResizeTextarea';
import config from '../../../../../config/config';
import { Tooltip } from '@mui/material';

const ModalChangeRepeatVisit: FC = () => {
  // Флаг, открыта ли форма
  const show = useAppSelector((state) => state.userReducer.modalChangeRepeatVisit);
  const { setShowModalChangeRepeatVisit, setIsReloadTable } = userSlice.actions;

  // Выбранная запись. Не подлежит редактированию!
  const selectedData = useAppSelector((state) => state.userReducer.selectedRepeatVisit);

  const dispatch = useAppDispatch();

  // Состояние для хранения измененных данных в форме
  const [data, setData] = useState<any>({});

  const [users, setUsers] = useState<any>([]);

  // Состояние, характерное для загрузки
  const [isPreload, setIsPreload] = useState<boolean>(false);

  const controller = useRef(new AbortController());

  const fetch = async () => {
    setIsPreload(true);

    if (config.url_provet_api) {
      axios
        .get(`${config.url_provet_api}directories/users`, {
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
    }
  };

  // Обработчик монтирования компонента
  useEffect(() => {
    if (show) {
      //controller.current = new AbortController();

      const {
        animal_name,
        animal_type_id,
        breed_name,
        content,
        nickname,
        owner_full_name,
        subRows,
        age,
        ...remainingData
      } = selectedData;

      setData({ ...remainingData });

      fetch();
    }
  }, [show]);

  const handleUpdate = async () => {
    setIsPreload(true);

    setIsReloadTable(true);

    if (config.url_provet_api) {
      axios
        .patch(`${config.url_provet_api}directories/repeat_visits/repeat_visit`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          dispatch(setIsReloadTable(true));
          successHandler('Запись изменена');

          handleClose();
        })
        .catch((error) => {
          errorHandler(error);
        })
        .finally(() => {
          setIsReloadTable(true);
          setIsPreload(false);
        });
    }
  };

  // Очистка формы
  const cleanForm = () => {
    setData({});
    setIsPreload(false);
  };

  const handleClose = (): void => {
    dispatch(setShowModalChangeRepeatVisit(false));

    // При закрытии обрыв всех запросов
    //controller.current.abort();
    cleanForm();
  };

  const autoResizeTextArea = (e: any) => {
    e.target.style.height = 'auto'; // Сбрасываем высоту
    e.target.style.height = `${e.target.scrollHeight}px`; // Устанавливаем новую высоту
  };

  return (
    <Modal
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleClose}
    >
      <Modal.Header className="justify-content-center">
        <Modal.Title className="fs-6">{`Карточка повторного приема`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1 pb-1">
        <Container fluid>
          <Row>
            <Col className="ps-0">
              <Form id="formModal">
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Врач
                    <span>
                      <Tooltip arrow title="Обязательное поле" placement="top">
                        <span
                          style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </span>
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
                        <option value="" selected={selectedData?.name === ''}>
                          Выберите врача
                        </option>
                        {users.map((obj: any) => {
                          if (selectedData?.user_id !== obj.id) {
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
                      value={data?.weight}
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          weight: e.target.value.replace(/,/g, '.'),
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Дата возникновения болезни
                    <span>
                      <Tooltip arrow title="Обязательное поле" placement="top">
                        <span
                          style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </span>
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="date"
                      value={data?.disease_onset_date && data.disease_onset_date}
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
                    <span>
                      <Tooltip arrow title="Обязательное поле" placement="top">
                        <span
                          style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </span>
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
                    <span>
                      <Tooltip arrow title="Обязательное поле" placement="top">
                        <span
                          style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </span>
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
                    <span>
                      <Tooltip arrow title="Обязательное поле" placement="top">
                        <span
                          style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </span>
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
                    <span>
                      <Tooltip arrow title="Обязательное поле" placement="top">
                        <span
                          style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </span>
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
                    <span>
                      <Tooltip arrow title="Обязательное поле" placement="top">
                        <span
                          style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </span>
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
                Изменить&nbsp;
                {isPreload && <Spinner size="sm" style={{ color: '#fff' }} />}
              </div>
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalChangeRepeatVisit;

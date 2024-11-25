import { FC, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { IBreed, IAnimalType, IOwner } from '../../../../store/reducers/UserSlice/UserSliceTypes';
import ProvetAPI from '../../../../utils/ProvetAPI';
import { useParams } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { PlusLg } from 'react-bootstrap-icons';
import config from '../../../../config/config';

const ModalAddPatient: FC = () => {
  // Флаг, открыта ли форма
  const show = useAppSelector((state) => state.userReducer.modalAddPatient);
  const {
    setShowModalAddPatient,
    setShowModalAddAnimalType,
    setSelectedAnimalTypeIdForParent,
    setSelectedBreedIdForParent,
    setIsReloadTable,
    setShowModalAddBreed,
  } = userSlice.actions;

  const [animalTypes, setAnimalTypes] = useState<IAnimalType[]>([]);
  const [breeds, setBreeds] = useState<IBreed[]>([]);
  const [owners, setOwners] = useState<IOwner[]>([]);

  const [selectedAnimalType, setSelectedAnimalType] = useState<any>(-1);

  const dispatch = useAppDispatch();

  const controller = useRef(new AbortController());

  // Состояние для хранения измененных данных в форме
  const [data, setData] = useState<any>({});

  const { owner_idParam } = useParams();

  // Состояние, характерное для загрузки
  const [isPreload, setIsPreload] = useState<boolean>(false);

  let isAddingAnimalType = useAppSelector(
    (state) => state.userReducer.selectedAnimalTypeIdForParent,
  );
  let isAddingBreed = useAppSelector((state) => state.userReducer.selectedBreedIdForParent);

  const fetch = async () => {
    const api = new ProvetAPI();

    // Получаем справочники
    let res: any = await api.getList('breeds', controller.current, true);
    if (res) setBreeds(res.rows);

    res = await api.getList('animal_types', controller.current, true);
    if (res) setAnimalTypes(res.rows);

    res = await api.getList('owners', controller.current, true);
    if (res) setOwners(res.rows);
  };

  if (show) {
    // Обновляем
    if (isAddingAnimalType) {
      if (isAddingAnimalType !== selectedAnimalType && isAddingAnimalType !== -1) {
        setSelectedAnimalType(isAddingAnimalType);
        setData({
          ...data,
          animal_type_id: Number(isAddingAnimalType),
        });

        fetch();
      }
    }

    // Обновляем
    if (isAddingBreed) {
      if (isAddingBreed !== data.breed_id && isAddingBreed !== -1) {
        setData({
          ...data,
          breed_id: Number(isAddingBreed),
        });

        fetch();
      }
    }
  }

  // Обработчик монтирования компонента
  useEffect(() => {
    if (show) {
      controller.current = new AbortController();

      setData({ ...data });
      setData({
        ...data,
        owner_id: Number(owner_idParam),
        is_castrated: false,
      });

      fetch();
    }
  }, [show]);

  const handleUpdate = async () => {
    setIsPreload(true);

    if (config.url_provet_api) {
      axios
        .post(`${config.url_provet_api}directories/patients/patient`, data, {
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
    }
  };

  // Очистка формы
  const cleanForm = () => {
    setData({});
    setIsPreload(false);
    setAnimalTypes([]);
    setBreeds([]);
    setSelectedAnimalType(-1);
    dispatch(setSelectedAnimalTypeIdForParent(null));
    dispatch(setSelectedBreedIdForParent(null));
  };

  const handleClose = (): void => {
    dispatch(setShowModalAddPatient(false));

    // При закрытии обрыв всех запросов
    controller.current.abort();
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
        <Modal.Title className="fs-6">{`Добавление пациента`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1 pb-1">
        <Container fluid>
          <Row>
            <Col className="ps-0">
              <Form id="formModal">
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Кличка
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
                      type="text"
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          nickname: e.target.value != '' ? e.target.value : undefined,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Окрас
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          color: e.target.value != '' ? e.target.value : undefined,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={10}>
                    Кастрировано
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
                  <Col sm={2}>
                    <Form.Check
                      className="pt-2 checkSwitch"
                      type="switch"
                      checked={data?.is_castrated}
                      onChange={(e) =>
                        setData({
                          ...data,
                          is_castrated: e.target.checked,
                        })
                      }
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Владелец
                  </Form.Label>
                  <Col sm={8}>
                    {owners.length !== 0 ? (
                      <Form.Select
                        aria-label="select"
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            owner_id: Number(e.target.value),
                          });
                        }}
                      >
                        <option value="" selected={data?.name === ''}>
                          Выберите врача
                        </option>
                        {owners.map((obj: any) => {
                          if (data?.owner_id !== obj.id) {
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
                    Вид
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
                  <Col sm={8} className="d-flex align-items-center justify-content-center">
                    {animalTypes.length !== 0 ? (
                      <Form.Select
                        aria-label="select"
                        onChange={(e: any) => {
                          setSelectedAnimalType(
                            e.target.value === '' ? -1 : Number(e.target.value),
                          );
                          setData({
                            ...data,
                            animal_type_id: Number(e.target.value),
                          });
                        }}
                      >
                        <option value="" selected disabled>
                          Выберите вид животного
                        </option>
                        {animalTypes.map((obj) => {
                          if (data?.animal_type_id !== obj.id) {
                            return (
                              <option key={obj.id} value={obj.id}>
                                {obj.name}
                              </option>
                            );
                          } else {
                            return (
                              <option key={obj.id} value={obj.id} selected>
                                {obj.name}
                              </option>
                            );
                          }
                        })}
                      </Form.Select>
                    ) : (
                      <Spinner variant="primary" />
                    )}
                    {animalTypes.length !== 0 && (
                      <Tooltip arrow title="Добавить вид">
                        <IconButton
                          onClick={() => {
                            dispatch(setShowModalAddAnimalType(true));
                            // Чтобы дочерняя форма поняла, что она нужна для родителя
                            dispatch(setSelectedAnimalTypeIdForParent(data.animal_type));
                          }}
                        >
                          <PlusLg color="green" size={20} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Порода
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
                  <Col sm={8} className="d-flex align-items-center justify-content-center">
                    {selectedAnimalType != -1 ? (
                      breeds.length !== 0 ? (
                        <Form.Select
                          aria-label="select"
                          onChange={(e: any) => {
                            setData({ ...data, breed_id: Number(e.target.value) });
                          }}
                        >
                          <option value="" selected disabled>
                            Выберите породу
                          </option>
                          {breeds
                            .filter((obj: IBreed) => obj.animal_type_id === data?.animal_type_id)
                            .map((obj: IBreed) => (
                              <option
                                key={obj.id}
                                value={obj.id}
                                selected={data?.breed_id === obj.id}
                              >
                                {obj.name}
                              </option>
                            ))}
                        </Form.Select>
                      ) : (
                        <Spinner variant="primary" />
                      )
                    ) : (
                      <a>Не выбран вид животного</a>
                    )}
                    {selectedAnimalType !== -1 && breeds.length !== 0 && (
                      <Tooltip arrow title="Добавить породу">
                        <IconButton
                          onClick={() => {
                            dispatch(setShowModalAddBreed(true));
                            // Чтобы дочерняя форма поняла, что она нужна для родителя
                            dispatch(setSelectedAnimalTypeIdForParent(data.animal_type_id));
                            dispatch(setSelectedBreedIdForParent(-1));
                          }}
                        >
                          <PlusLg color="green" size={20} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Дата рождения
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
                      value={data?.date_birth && data.date_birth.substring(0, 10)}
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          date_birth: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Пол
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
                  <Col sm={4} className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      name="gender"
                      value={1}
                      label="Мужской"
                      checked={data?.gender === 1}
                      onChange={(e: any) => {
                        setData({ ...data, gender: 1 });
                      }}
                    />
                  </Col>
                  <Col sm={4} className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      name="gender"
                      value={2}
                      label="Женский"
                      checked={data?.gender === 2}
                      onChange={(e: any) => {
                        setData({ ...data, gender: 2 });
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

export default ModalAddPatient;

import { FC, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { URL_PROVET, URL_PROVET_API } from '../../../../config/config';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { IBreed, IAnimalType } from '../../../../store/reducers/UserSlice/UserSliceTypes';
import { formatDate } from '../../../../utils/dateFormatter';
import ProvetAPI from '../../../../utils/ProvetAPI';
import { IconButton, Tooltip } from '@mui/material';
import { PlusLg } from 'react-bootstrap-icons';

const ModalChangePatient: FC = () => {
  // Флаг, открыта ли форма
  const show = useAppSelector((state) => state.userReducer.modalChangePatient);
  const {
    setShowModalChangePatient,
    setShowModalAddBreed,
    setShowModalAddAnimalType,
    setSelectedAnimalTypeIdForParent,
    setSelectedBreedIdForParent,
    setIsReloadTable,
  } = userSlice.actions;

  // Выбранная запись. Не подлежит редактированию!
  const selectedData = useAppSelector((state) => state.userReducer.selectedPatient);

  const [animalTypes, setAnimalTypes] = useState<IAnimalType[]>([]);
  const [breeds, setBreeds] = useState<IBreed[]>([]);

  const [selectedAnimalType, setSelectedAnimalType] = useState<any>(-1);

  const dispatch = useAppDispatch();

  const controller = useRef(new AbortController());

  // Состояние для хранения измененных данных в форме
  const [data, setData] = useState<any>({});

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
  };

  if (show) {
    // Обновляем
    if (isAddingAnimalType) {
      if (isAddingAnimalType !== data.animal_type_id && isAddingAnimalType !== -1) {
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

      setData({ ...selectedData });

      setSelectedAnimalType(data?.animal_type_id);

      fetch();
    }
  }, [show]);

  const handleUpdate = async () => {
    setIsPreload(true);

    if (URL_PROVET) {
      axios
        .patch(`${URL_PROVET_API}directories/patients/patient`, data, {
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
    dispatch(setShowModalChangePatient(false));
    setSelectedAnimalType(-1);

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
        <Modal.Title className="fs-6">{`Карточка пациента`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1 pb-1">
        <Container fluid>
          <Row>
            <Col className="ps-0">
              <Form id="formModal">
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Кличка
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      value={data?.nickname}
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
                      value={data?.color}
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
                      onChange={(e) => {
                        setData({
                          ...data,
                          is_castrated: e.target.checked,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Вид
                  </Form.Label>
                  <Col sm={7} className="d-flex align-items-center justify-content-center">
                    {animalTypes.length !== 0 ? (
                      <Form.Select
                        aria-label="select"
                        onChange={(e: any) => {
                          if (e.target.value === '') setSelectedAnimalType(-1);
                          setData({
                            ...data,
                            animal_type_id: Number(e.target.value),
                            breed_id: undefined,
                          });
                        }}
                      >
                        <option value="" selected={data?.nickname === ''} disabled>
                          Выберите вид животного
                        </option>
                        {animalTypes.map((obj: any) => {
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
                  {/* <Col sm={1} className="d-flex align-items-center justify-content-center">
                    <Box className="d-flex flex-nowrap align-items-center align-content-start">
                      <Tooltip arrow title="Добавить вид">
                        <IconButton
                          onClick={() => {
                            //dispatch(setShowModalAddPatient(true));
                          }}
                        >
                          <PlusLg color="green" size={20} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Col> */}
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Порода
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
                          <option
                            value=""
                            selected={data?.breed_id === '' || data?.breed_id === undefined}
                            disabled
                          >
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
            <Row>Дата создания профиля: {formatDate(selectedData?.created_at)}</Row>
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

export default ModalChangePatient;

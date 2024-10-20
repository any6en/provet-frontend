import { FC, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { URL_PROVET_API } from '../../../../config/config';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { IBreed, IAnimalType } from '../../../../store/reducers/UserSlice/UserSliceTypes';
import ProvetAPI from '../../../../utils/ProvetAPI';

const ModalAddPatient: FC = () => {
  // Флаг, открыта ли форма
  const show = useAppSelector((state) => state.userReducer.modalAddPatient);
  const { setShowModalAddPatient, setIsReloadTable } = userSlice.actions;

  const [animalTypes, setAnimalTypes] = useState<IAnimalType[]>([]);
  const [breeds, setBreeds] = useState<IBreed[]>([]);

  const [selectedSpecie, setSelectedSpecie] = useState<any>(-1);

  const dispatch = useAppDispatch();

  const controller = useRef(new AbortController());

  // Состояние для хранения измененных данных в форме
  const [data, setData] = useState<any>({});

  // Состояние, характерное для загрузки
  const [isPreload, setIsPreload] = useState<boolean>(false);

  // Обработчик монтирования компонента
  useEffect(() => {
    if (show) {
      controller.current = new AbortController();

      const fetchData = async () => {
        const api = new ProvetAPI();

        // Получаем справочники
        let res: any = await api.getList('breeds', controller.current, true);
        if (res) setBreeds(res.rows);

        res = await api.getList('animal_types', controller.current, true);
        if (res) setAnimalTypes(res.rows);
      };
      fetchData();
    }
  }, [show]);

  const handleUpdate = async () => {
    setIsPreload(true);

    if (URL_PROVET_API) {
      axios
        .post(`${URL_PROVET_API}directories/patients/patient`, data, {
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
  };

  const handleClose = (): void => {
    dispatch(setShowModalAddPatient(false));
    setSelectedSpecie(-1);

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
                    Вид
                  </Form.Label>
                  <Col sm={8} className="d-flex align-items-center justify-content-center">
                    {animalTypes.length !== 0 ? (
                      <Form.Select
                        aria-label="select"
                        onChange={(e: any) => {
                          setSelectedSpecie(e.target.value === '' ? -1 : Number(e.target.value));
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
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Порода
                  </Form.Label>
                  <Col sm={8} className="d-flex align-items-center justify-content-center">
                    {selectedSpecie != -1 ? (
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

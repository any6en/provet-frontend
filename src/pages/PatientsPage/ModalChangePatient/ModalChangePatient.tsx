import { FC, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { URL_PROVET } from '../../../config/config';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { userSlice } from '../../../store/reducers/UserSlice/UserSlice';
import { IBreed, IPatient, ISpecie } from '../../../store/reducers/UserSlice/UserSliceTypes';
import { formatDate } from '../../../utils/dateFormatter';
import { PlusLg } from 'react-bootstrap-icons';
import { Box, IconButton, Tooltip } from '@mui/material';

const ModalChangePatient: FC = () => {
  // Флаг, открыта ли форма
  const show = useAppSelector((state) => state.userReducer.modalChangePatient);
  const { setShowModalChangePatient, setIsReloadTable } = userSlice.actions;

  // Выбранная запись. Не подлежит редактированию!
  const selectedData = useAppSelector((state) => state.userReducer.selectedPatient);

  const [species, setSpecies] = useState<ISpecie[]>([]);
  const [breeds, setBreeds] = useState<IBreed[]>([]);

  const [selectedSpecie, setSelectedSpecie] = useState<any>(-1);

  const dispatch = useAppDispatch();

  // Состояние для хранения измененных данных в форме
  const [data, setData] = useState<any>({});

  // Состояние, характерное для загрузки
  const [isPreload, setIsPreload] = useState<boolean>(false);

  // Обработчик монтирования компонента
  useEffect(() => {
    if (show) {
      //controller.current = new AbortController();
      setData({ ...selectedData });
      setSelectedSpecie(data?.speciesId);

      const fetchBreeds = async () => {
        setIsReloadTable(true);
        if (URL_PROVET) {
          axios
            .get(`${URL_PROVET}breeds`, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              setBreeds(response.data.response.rows);
            })
            .catch(() => {})
            .finally(() => {
              setIsReloadTable(false);
            });
        }
      };
      const fetchSpecies = async () => {
        setIsReloadTable(true);
        if (URL_PROVET) {
          axios
            .get(`${URL_PROVET}species`, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              setSpecies(response.data.response.rows);
            })
            .catch(() => {})
            .finally(() => {
              setIsReloadTable(false);
            });
        }
      };
      fetchSpecies();
      fetchBreeds();
    }
  }, [show]);

  const handleUpdate = async () => {
    setIsPreload(true);

    if (URL_PROVET) {
      axios
        .patch(`${URL_PROVET}patient`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          dispatch(setIsReloadTable(true));
          successHandler(res.data.response.message);

          handleClose();
        })
        .catch((error) => {})
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
    dispatch(setShowModalChangePatient(false));
    setSelectedSpecie(-1);

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
                      value={data?.name}
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          name: e.target.value,
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
                    {species.length !== 0 ? (
                      <Form.Select
                        aria-label="select"
                        onChange={(e: any) => {
                          if (e.target.value === '') setSelectedSpecie(-1);
                          setData({
                            ...data,
                            animalTypeId: Number(e.target.value),
                          });
                        }}
                      >
                        <option value="" selected={selectedData?.name === ''}></option>
                        {species.map((obj) => {
                          if (selectedData?.animalTypeId !== obj.id) {
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
                  <Col sm={1} className="d-flex align-items-center justify-content-center">
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
                            setData({ ...data, breedId: Number(e.target.value) });
                          }}
                        >
                          <option value="Не выбрано" selected={data?.name === ''}></option>
                          {breeds
                            .filter((obj: IBreed) => obj.animalTypeId === data?.animalTypeId)
                            .map((obj: IBreed) => (
                              <option
                                key={obj.id}
                                value={obj.id}
                                selected={data?.breedId === obj.id}
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
                      value={data?.dateBirth && data.dateBirth.substring(0, 10)}
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          dateBirth: e.target.value,
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
            <Row>Дата создания профиля: {formatDate(selectedData?.createdAt)}</Row>
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

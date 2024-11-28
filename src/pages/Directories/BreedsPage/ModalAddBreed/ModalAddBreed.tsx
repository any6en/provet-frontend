import { FC, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { IAnimalType } from '../../../../store/reducers/UserSlice/UserSliceTypes';
import config from '../../../../config/config';
import { Tooltip } from '@mui/material';

const ModalAddBreed: FC = () => {
  // Флаг, открыта ли форма
  const show = useAppSelector((state) => state.userReducer.modalAddBreed);
  const {
    setShowModalAddBreed,
    setSelectedAnimalTypeIdForParent,
    setSelectedBreedIdForParent,
    setIsReloadTable,
  } = userSlice.actions;

  const [animalTypes, setAnimalTypes] = useState<IAnimalType[]>([]);

  const dispatch = useAppDispatch();

  // Состояние для хранения измененных данных в форме
  const [data, setData] = useState<any>({});

  // Состояние, характерное для загрузки
  const [isPreload, setIsPreload] = useState<boolean>(false);

  let isParentAnimalType = useAppSelector(
    (state) => state.userReducer.selectedAnimalTypeIdForParent,
  );
  let isParent = useAppSelector((state) => state.userReducer.selectedBreedIdForParent);

  if (isParent && isParentAnimalType) {
    if (data.animal_type_id !== isParentAnimalType)
      setData({
        ...data,
        animal_type_id: Number(isParentAnimalType),
      });
  }

  // Обработчик монтирования компонента
  useEffect(() => {
    if (show) {
      //controller.current = new AbortController();

      const fetch = async () => {
        setIsReloadTable(true);

        if (config.url_provet_api) {
          axios
            .get(`${config.url_provet_api}directories/animal_types`, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              setAnimalTypes(response.data.response.rows);
            })
            .catch(() => {})
            .finally(() => {
              setIsReloadTable(false);
            });
        }
      };
      fetch();
    }
  }, [show]);

  const handleUpdate = async () => {
    setIsPreload(true);

    if (config.url_provet_api) {
      axios
        .post(`${config.url_provet_api}directories/breeds/breed`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          dispatch(setIsReloadTable(true));
          successHandler('Запись добавлена');
          if (isParent) {
            dispatch(setSelectedBreedIdForParent(response.data.response.id));
          }
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
    dispatch(setShowModalAddBreed(false));

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
        <Modal.Title className="fs-6">{`Добавление породы`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1 pb-1">
        <Container fluid>
          <Row>
            <Col className="ps-0">
              <Form id="formModal">
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
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      autoComplete="off"
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          name: e.target.value !== '' ? e.target.value : undefined,
                        });
                      }}
                    />
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
                          setData({
                            ...data,
                            animal_type_id: Number(e.target.value),
                          });
                        }}
                      >
                        <option value="" disabled selected>
                          Выберите вид животного
                        </option>
                        {animalTypes.map((obj) => {
                          if (isParent) {
                            if (isParentAnimalType !== obj.id) {
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
                          } else {
                            <option key={obj.id} value={obj.id}>
                              {obj.name}
                            </option>;
                          }
                        })}
                        {animalTypes.map((obj) => {
                          return (
                            <option key={obj.id} value={obj.id}>
                              {obj.name}
                            </option>
                          );
                        })}
                      </Form.Select>
                    ) : (
                      <Spinner variant="primary" />
                    )}
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

export default ModalAddBreed;

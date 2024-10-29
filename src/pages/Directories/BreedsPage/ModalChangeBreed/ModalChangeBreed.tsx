import { FC, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { URL_PROVET_API } from '../../../../config/config';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { IAnimalType } from '../../../../store/reducers/UserSlice/UserSliceTypes';

const ModalChangeBreed: FC = () => {
  // Флаг, открыта ли форма
  const show = useAppSelector((state) => state.userReducer.modalChangeBreed);
  const { setShowModalChangeBreed, setIsReloadTable } = userSlice.actions;

  // Выбранная запись. Не подлежит редактированию!
  const selectedData = useAppSelector((state) => state.userReducer.selectedBreed);

  const [animalTypes, setAnimalTypes] = useState<IAnimalType[]>([]);

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

      const fetch = async () => {
        setIsReloadTable(true);
        axios
          .get(`${URL_PROVET_API}directories/animal_types`, {
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
      };
      fetch();
    }
  }, [show]);

  const handleUpdate = async () => {
    setIsPreload(true);

    axios
      .patch(`${URL_PROVET_API}directories/breeds/breed`, data, {
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
  };

  // Очистка формы
  const cleanForm = () => {
    setData({});
    setIsPreload(false);
  };

  const handleClose = (): void => {
    dispatch(setShowModalChangeBreed(false));

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
        <Modal.Title className="fs-6">{`Карточка породы`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1 pb-1">
        <Container fluid>
          <Row>
            <Col className="ps-0">
              <Form id="formModal">
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Порода
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
                        <option value="" selected={selectedData?.name === ''}></option>
                        {animalTypes.map((obj) => {
                          if (selectedData?.animal_type_id !== obj.id) {
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

export default ModalChangeBreed;

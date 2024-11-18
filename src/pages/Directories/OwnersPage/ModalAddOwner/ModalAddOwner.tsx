import { FC, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { formatDate } from '../../../../utils/dateFormatter';
import { URL_PROVET_API } from '../../../../config/config';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { Tooltip } from '@mui/material';

const ModalAddOwner: FC = () => {
  // Флаг, открыта ли форма
  const show = useAppSelector((state) => state.userReducer.modalAddOwner);
  const { setShowModalAddOwner, setIsReloadTable } = userSlice.actions;

  const dispatch = useAppDispatch();

  // Состояние для хранения измененных данных в форме
  const [data, setData] = useState<any>({});

  // Состояние, характерное для загрузки
  const [isPreload, setIsPreload] = useState<boolean>(false);

  const controller = useRef(new AbortController());

  // Обработчик монтирования компонента
  useEffect(() => {
    if (show) {
      controller.current = new AbortController();

      setData({ ...data, pd_agreement_signed: false });
    }
  }, [show]);

  const handleUpdate = async () => {
    setIsPreload(true);

    axios
      .post(`${URL_PROVET_API}directories/owners/owner`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
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
    dispatch(setShowModalAddOwner(false));

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
        <Modal.Title className="fs-6">{`Добавление владельца`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1 pb-1">
        <Container fluid>
          <Row>
            <Col className="ps-0">
              <Form id="formModal">
                <Container>
                  <h4 className="text-center">Общая информация</h4>
                  <Form.Group className="mb-3" as={Row}>
                    <Form.Label className="fs-6" column sm={4}>
                      Имя
                      <span>
                        <Tooltip arrow title="Обязательное поле" placement="top">
                          <span
                            style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}
                          >
                            <span>*</span>
                          </span>
                        </Tooltip>
                        <Tooltip
                          arrow
                          title="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                          placement="top"
                        >
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              color: 'blue',
                            }}
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
                            first_name: e.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" as={Row}>
                    <Form.Label className="fs-6" column sm={4}>
                      Фамилия
                      <span>
                        <Tooltip arrow title="Обязательное поле" placement="top">
                          <span
                            style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}
                          >
                            <span>*</span>
                          </span>
                        </Tooltip>
                      </span>
                      <Tooltip
                        arrow
                        title="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                        placement="top"
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'blue',
                          }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            last_name: e.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" as={Row}>
                    <Form.Label className="fs-6" column sm={4}>
                      Отчество
                      <span>
                        <Tooltip arrow title="Обязательное поле" placement="top">
                          <span
                            style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}
                          >
                            <span>*</span>
                          </span>
                        </Tooltip>
                      </span>
                      <Tooltip
                        arrow
                        title="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                        placement="top"
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'blue',
                          }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            patronymic: e.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" as={Row}>
                    <Form.Label className="fs-6" column sm={4}>
                      Адрес
                      <Tooltip
                        arrow
                        title="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                        placement="top"
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'blue',
                          }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            address: e.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" as={Row}>
                    <Form.Label className="fs-6" column sm={4}>
                      Дата рождения
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="date"
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
                </Container>
                <Container>
                  <h4 className="text-center">Паспортные данные</h4>
                  <Form.Group className="mb-3" as={Row}>
                    <Form.Label className="fs-6" column sm={4}>
                      Серия
                      <Tooltip
                        arrow
                        title="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                        placement="top"
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'blue',
                          }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            passport_series: e.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" as={Row}>
                    <Form.Label className="fs-6" column sm={4}>
                      Номер
                      <Tooltip
                        arrow
                        title="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                        placement="top"
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'blue',
                          }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            passport_number: e.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" as={Row}>
                    <Form.Label className="fs-6" column sm={4}>
                      Кем выдан
                      <Tooltip
                        arrow
                        title="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                        placement="top"
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'blue',
                          }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            issued_by: e.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" as={Row}>
                    <Form.Label className="fs-6" column sm={4}>
                      Код подразделения
                      <Tooltip
                        arrow
                        title="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                        placement="top"
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'blue',
                          }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            subdivision_code: e.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" as={Row}>
                    <Form.Label className="fs-6" column sm={4}>
                      Дата выдачи
                      <Tooltip
                        arrow
                        title="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                        placement="top"
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: 'blue',
                          }}
                        >
                          <span>*</span>
                        </span>
                      </Tooltip>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="date"
                        onChange={(e: any) => {
                          setData({
                            ...data,
                            issue_date: e.target.value,
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" as={Row}>
                    <p>
                      Для подписания договора заполните поля, помеченные синей звездочкой.
                      <p
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={() => {
                          setIsPreload(true);

                          axios
                            .post(`${URL_PROVET_API}document_generator/pd_agreement_sign`, data, {
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              responseType: 'blob',
                            })
                            .then((response) => {
                              window.open(URL.createObjectURL(response.data));
                              handleClose();
                            })
                            .catch((error) => {
                              errorHandler(error);
                            })
                            .finally(() => {
                              setIsPreload(false);
                            });
                        }}
                      >
                        Подписать
                      </p>
                    </p>

                    <Form.Label className="fs-6" column sm={10}>
                      Подписан ли договор об согласии на обработку персональных данных
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
                        defaultChecked={false}
                        onChange={(e) =>
                          setData({
                            ...data,
                            pd_agreement_signed: e.target.checked,
                          })
                        }
                      />
                    </Col>
                  </Form.Group>
                </Container>
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

export default ModalAddOwner;

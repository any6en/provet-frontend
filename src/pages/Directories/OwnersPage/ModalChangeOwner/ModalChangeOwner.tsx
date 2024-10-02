import { FC, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { formatDate } from '../../../../utils/dateFormatter';
import { URL_PROVET_API } from '../../../../config/config';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';

const ModalChangeOwner: FC = () => {
  // Флаг, открыта ли форма
  const show = useAppSelector((state) => state.userReducer.modalChangeOwner);
  const { setShowModalChangeOwner, setIsReloadTable } = userSlice.actions;

  // Выбранная запись. Не подлежит редактированию!
  const selectedData = useAppSelector((state) => state.userReducer.selectedOwner);

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
      setData({ ...selectedData });
    }
  }, [show]);

  const handleUpdate = async () => {
    setIsPreload(true);

    if (URL_PROVET_API) {
      axios
        .patch(`${URL_PROVET_API}directories/owners/owner`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          dispatch(setIsReloadTable(true));
          successHandler(res.data.response.success);

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

  const handleSignDocument = async () => {
    try {
      // Отправляем запрос на бэкенд с идентификатором владельца
      const response = await fetch(`https://localhost:7182/owners/generate_document/${data.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const blob = await response.blob();

      // Создаем ссылку на файл и начинаем загрузку
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'СНоПД.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Ошибка при создании документа:', error);
    }
  };

  // Очистка формы
  const cleanForm = () => {
    setData({});
    setIsPreload(false);
  };

  const handleClose = (): void => {
    dispatch(setShowModalChangeOwner(false));

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
        <Modal.Title className="fs-6">{`Карточка владельца`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1 pb-1">
        <Container fluid>
          <Row>
            <Col className="ps-0">
              <Form id="formModal">
                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Имя
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      value={data?.firstName}
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          firstName: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>

                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Фамилия
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      value={data?.lastName}
                      onChange={(e: any) => {
                        setData({
                          ...data,
                          lastName: e.target.value,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>

                <Form.Group className="mb-3" as={Row}>
                  <Form.Label className="fs-6" column sm={4}>
                    Отчество
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      value={data?.patronymic}
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
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      value={data?.address}
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
                  <Col sm={8}>
                    <Form.Control
                      as="select"
                      value={data?.gender || ''}
                      onChange={(e: any) => {
                        setData({ ...data, gender: Number(e.target.value) });
                      }}
                    >
                      <option value="" selected={data?.gender === ''}></option>
                      {[
                        { id: 1, name: 'Мужской' },
                        { id: 2, name: 'Женский' },
                        { id: 9, name: 'Неизвестно' },
                      ].map((obj) => {
                        if (data?.gender !== obj.id) {
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
                    </Form.Control>
                  </Col>
                </Form.Group>
              </Form>
            </Col>
            <Row>Дата создания профиля: {formatDate(selectedData?.createdAt)}</Row>
            <Row>
              <a className="p-0" style={{ color: 'blue' }} onClick={handleSignDocument}>
                Подписать согласие на обработку персональных данных
              </a>
            </Row>
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

export default ModalChangeOwner;

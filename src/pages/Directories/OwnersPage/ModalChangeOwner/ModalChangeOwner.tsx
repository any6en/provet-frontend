import { FC, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { formatDate } from '../../../../utils/dateFormatter';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { Tooltip } from '@mui/material';
import FormField from '../components/FormField';
import { Printer } from 'react-bootstrap-icons';
import config from '../../../../config/config';

const ModalChangeOwner: FC = () => {
  const show = useAppSelector((state) => state.userReducer.modalChangeOwner);
  const { setShowModalChangeOwner, setIsReloadTable } = userSlice.actions;
  const selectedData = useAppSelector((state) => state.userReducer.selectedOwner);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any>({});

  const [isPreload, setIsPreload] = useState<boolean>(false);
  const [isPreloadPrintDocument, setIsPreloadPrintDocument] = useState<boolean>(false);

  const controller = useRef(new AbortController());

  useEffect(() => {
    if (show) {
      controller.current = new AbortController();
      setData({ ...selectedData });
    }
  }, [show, selectedData]);

  const handleUpdate = async () => {
    setIsPreload(true);

    if (config.url_provet_api) {
      axios
        .patch(`${config.url_provet_api}directories/owners/owner`, data, {
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

  const handleDownloadDocument = async () => {
    setIsPreloadPrintDocument(true);

    if (config.url_provet_api) {
      axios
        .post(`${config.url_provet_api}document_generator/pd_agreement_sign`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        })
        .then((response) => {
          window.open(URL.createObjectURL(response.data));
          handleClose();
        })
        .catch(() => {
          errorHandler('Ошибка! Указаны неверные данные?');
        })
        .finally(() => {
          setIsPreloadPrintDocument(false);
        });
    }
  };

  const cleanForm = () => {
    setData({});
    setIsPreload(false);
  };

  const handleClose = (): void => {
    dispatch(setShowModalChangeOwner(false));
    controller.current.abort();
    cleanForm();
  };

  return (
    <Modal show={show} centered onHide={handleClose}>
      <Modal.Header className="justify-content-center">
        <Modal.Title className="fs-6">Карточка владельца</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1 pb-1">
        <Container fluid>
          <Row>
            <Col className="ps-0">
              <Form id="formModal">
                <Container>
                  <h5 className="text-center">Общая информация</h5>
                  <FormField
                    label="Имя"
                    type="text"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    value={data?.first_name}
                    onChange={(e) =>
                      setData({
                        ...data,
                        first_name: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                    required
                  />
                  <FormField
                    label="Фамилия"
                    type="text"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    value={data?.last_name}
                    onChange={(e) =>
                      setData({
                        ...data,
                        last_name: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                    required
                  />
                  <FormField
                    label="Отчество"
                    type="text"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    value={data?.patronymic}
                    onChange={(e) =>
                      setData({
                        ...data,
                        patronymic: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                    required
                  />
                  <FormField
                    label="Номер телефона"
                    value={data?.phone_number}
                    onChange={(e) =>
                      setData({
                        ...data,
                        phone_number: e.target.value != '' ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Адрес"
                    type="text"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    value={data?.address}
                    onChange={(e) =>
                      setData({
                        ...data,
                        address: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />

                  <FormField
                    label="Дата рождения"
                    type="date"
                    value={data?.date_birth}
                    onChange={(e) => setData({ ...data, date_birth: e.target.value })}
                    required
                  />
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
                  <h5 className="text-center">Паспортные данные</h5>
                  <FormField
                    label="Серия паспорта"
                    type="text"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    value={data?.passport_series}
                    onChange={(e) =>
                      setData({
                        ...data,
                        passport_series: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Номер паспорта"
                    type="text"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    value={data?.passport_number}
                    onChange={(e) =>
                      setData({
                        ...data,
                        passport_number: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Кем выдан"
                    type="text"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    value={data?.passport_issued_by}
                    onChange={(e) =>
                      setData({
                        ...data,
                        passport_issued_by: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Код подразделения"
                    type="text"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    value={data.passport_subdivision_code}
                    onChange={(e) =>
                      setData({
                        ...data,
                        passport_subdivision_code:
                          e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Дата выдачи"
                    type="date"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    value={data?.passport_issue_date}
                    onChange={(e) => setData({ ...data, passport_issue_date: e.target.value })}
                  />
                  <Form.Group className="mb-3" as={Row}>
                    <Form.Label className="fs-6" column sm={10}>
                      Подписан ли договор об согласии на обработку персональных данных
                      <span>
                        <Tooltip arrow title="Обязательное поле" placement="top">
                          <span
                            style={{ display: 'inline-flex', alignItems: 'center', color: 'red' }}
                          >
                            *
                          </span>
                        </Tooltip>
                      </span>
                    </Form.Label>
                    <Col sm={2}>
                      <Form.Check
                        className="pt-2 checkSwitch"
                        type="switch"
                        checked={data?.pd_agreement_signed}
                        onChange={(e) =>
                          setData({
                            ...data,
                            pd_agreement_signed: e.target.checked,
                            date_pd_agreement_sign: e.target.checked ? Date.now() : null,
                          })
                        }
                      />
                    </Col>
                  </Form.Group>
                </Container>
              </Form>
            </Col>
            <Row>Дата создания: {formatDate(selectedData?.created_at)}</Row>
            {selectedData?.date_pd_agreement_sign && (
              <Row>Договор подписан: {formatDate(selectedData?.date_pd_agreement_sign)}</Row>
            )}

            <Row>Для подписания договора заполните поля, помеченные синей звездочкой</Row>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Row className="w-100">
          <Col sm={5}>
            <Tooltip arrow title="Печать договора об согласии на обработку персональных данных">
              <Button
                variant="secondary"
                className="d-flex align-items-center"
                onClick={handleDownloadDocument}
                disabled={isPreloadPrintDocument}
              >
                <Printer color="black" size={20} /> Печать&nbsp;
                {isPreloadPrintDocument && <Spinner size="sm" style={{ color: '#fff' }} />}
              </Button>
            </Tooltip>
          </Col>
          <Col sm={7} className="d-flex align-items-center justify-content-end">
            <Button
              variant="primary"
              onClick={handleUpdate}
              disabled={isPreload}
              className="px-0 sendFormAddDataButton"
            >
              <div className="d-flex align-items-center justify-content-center">
                Изменить&nbsp;{isPreload && <Spinner size="sm" style={{ color: '#fff' }} />}
              </div>
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalChangeOwner;

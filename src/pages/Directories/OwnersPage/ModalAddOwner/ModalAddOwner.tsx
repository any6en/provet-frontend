import { FC, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { errorHandler, successHandler } from '../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { Tooltip } from '@mui/material';
import { Printer } from 'react-bootstrap-icons';
import FormField from '../components/FormField';
import config from '../../../../config/config';

const ModalAddOwner: FC = () => {
  const show = useAppSelector((state) => state.userReducer.modalAddOwner);
  const { setShowModalAddOwner, setIsReloadTable } = userSlice.actions;
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any>({});
  const [isPreload, setIsPreload] = useState<boolean>(false);
  const [isPreloadPrintDocument, setIsPreloadPrintDocument] = useState<boolean>(false);
  const controller = useRef(new AbortController());

  useEffect(() => {
    if (show) {
      controller.current = new AbortController();
      setData({ ...data, pd_agreement_signed: false });
    }
  }, [show]);

  const handleUpdate = async () => {
    setIsPreload(true);

    if (config.url_provet_api) {
      axios
        .post(`${config.url_provet_api}directories/owners/owner`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(() => {
          dispatch(setIsReloadTable(true));
          successHandler('Запись добавлена');
          handleClose();
        })
        .catch((error) => errorHandler(error))
        .finally(() => setIsPreload(false));
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
        .catch((error) => {
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
    dispatch(setShowModalAddOwner(false));
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
        <Modal.Title className="fs-6">Добавление владельца</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1 pb-1">
        <Container fluid>
          <Row>
            <Col className="ps-0">
              <Form id="formModal">
                <Container>
                  <h4 className="text-center">Общая информация</h4>
                  <FormField
                    label="Имя"
                    required={true}
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    onChange={(e) =>
                      setData({
                        ...data,
                        first_name: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Фамилия"
                    required={true}
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    onChange={(e) =>
                      setData({
                        ...data,
                        last_name: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Отчество"
                    required={true}
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    onChange={(e) =>
                      setData({
                        ...data,
                        patronymic: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Номер телефона"
                    onChange={(e) =>
                      setData({
                        ...data,
                        phone_number: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Адрес"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
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
                    onChange={(e) => setData({ ...data, date_birth: e.target.value })}
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
                  <h4 className="text-center">Паспортные данные</h4>
                  <FormField
                    label="Серия"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    onChange={(e) =>
                      setData({
                        ...data,
                        passport_series: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Номер"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    onChange={(e) =>
                      setData({
                        ...data,
                        passport_number: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Кем выдан"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    onChange={(e) =>
                      setData({
                        ...data,
                        passport_issued_by: e.target.value != '' ? e.target.value : undefined,
                      })
                    }
                  />
                  <FormField
                    label="Код подразделения"
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
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
                    tooltip="Обязательное поле для подписания договора об согласии на обработку персональных данных"
                    type="date"
                    onChange={(e) => setData({ ...data, passport_issue_date: e.target.value })}
                  />
                </Container>
                <Form.Group className="mb-3" as={Row}>
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
                          // Проблема по временем. По часам...
                          date_pd_agreement_sign: e.target.checked ? Date.now() : undefined,
                        })
                      }
                    />
                  </Col>
                </Form.Group>
                <Row>Для подписания договора заполните поля, помеченные синей звездочкой</Row>
              </Form>
            </Col>
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
          <Col sm={7} className="d-flex align-items-center justify-content-end ">
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

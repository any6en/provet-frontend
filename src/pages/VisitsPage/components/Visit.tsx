import { FC, useState } from 'react';
import { Form, Row, Button, Col, Spinner } from 'react-bootstrap';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  ArrowClockwise,
  Pencil,
  PlusLg,
  Printer,
  QuestionCircle,
  Trash,
} from 'react-bootstrap-icons';
import { userSlice } from '../../../store/reducers/UserSlice/UserSlice';
import { useAppDispatch } from '../../../hooks/redux';
import AutoResizeTextarea from '../../../components/AutoResizeTextarea/AutoResizeTextarea';
import { URL_PROVET_API } from '../../../config/config';
import axios from 'axios';
import { errorHandler } from '../../../utils/alarmHandler';
import Swal from 'sweetalert2';

interface Props {
  visit: any;
  isPrimary: boolean;
}

const Visit: FC<Props> = ({ visit, isPrimary }) => {
  const {
    setShowModalChangePrimaryVisit,
    setSelectedPrimaryVisit,
    setShowModalChangeRepeatVisit,
    setSelectedRepeatVisit,
    setIsReloadTable,
    setShowModalAddRepeatVisit,
  } = userSlice.actions;

  const dispatch = useAppDispatch();

  const [isLoadPrintDocument, setIsLoadPrintDocument] = useState<boolean>(false);

  return (
    <Form className="px-3">
      <Row className="pb-3">
        <Col sm={9} className="d-flex align-items-center justify-content-center"></Col>
        <Col sm={1} className="d-flex align-items-center justify-content-center" />
        <Col sm={2} className="d-flex align-items-center justify-content-right">
          <Box className="d-flex flex-nowrap align-items-center align-content-start">
            <Tooltip arrow title="Обновить">
              <IconButton
                onClick={() => {
                  //etchAnimalTypes();
                }}
              >
                <ArrowClockwise />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Добавить вторичный прием">
              <IconButton
                onClick={() => {
                  dispatch(setSelectedRepeatVisit(visit));
                  dispatch(setShowModalAddRepeatVisit(true));
                }}
              >
                <PlusLg color="green" size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Редактировать">
              <IconButton
                onClick={() => {
                  if (isPrimary) {
                    dispatch(setShowModalChangePrimaryVisit(true));
                    dispatch(setSelectedPrimaryVisit(visit));
                  } else {
                    dispatch(setShowModalChangeRepeatVisit(true));
                    dispatch(setSelectedRepeatVisit(visit));
                  }
                }}
              >
                <Pencil color="green" size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Удалить">
              <IconButton
                onClick={() => {
                  const text = isPrimary
                    ? 'Удаление первичного приема приведет к удалению записей, связанных с ним, то есть вложенных повторных приемов на основе этого'
                    : 'Вы действительно хотите удалить этот повторный прием?';
                  const query = isPrimary
                    ? `primary_visits/primary_visit/${visit?.id}`
                    : `repeat_visits/repeat_visit/${visit?.id}`;
                  Swal.fire({
                    title: 'Вы уверены?',
                    text: text,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Да',
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      try {
                        await axios.delete(`${URL_PROVET_API}directories/${query}`, {
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        });

                        dispatch(setIsReloadTable(true));

                        Swal.fire({
                          title: 'Успешно!',
                          text: 'Запись была удалена',
                          icon: 'success',
                        });
                      } catch (error) {
                        Swal.fire({
                          title: 'Провал!',
                          text: 'Что-то пошло не так',
                          icon: 'error',
                        });
                      }
                    }
                  });
                }}
              >
                <Trash color="red" size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Скачать документ на печать">
              {!isLoadPrintDocument ? (
                <IconButton
                  onClick={async () => {
                    setIsLoadPrintDocument(true);
                    const document_type = isPrimary
                      ? `primary_visit?primary_visit_id=${visit?.id}`
                      : `repeat_visit?repeat_visit_id=${visit?.id}`;
                    axios
                      .get(`${URL_PROVET_API}document_generator/${document_type}`, {
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        responseType: 'blob',
                      })
                      .then((response) => {
                        window.open(URL.createObjectURL(response.data));
                      })
                      .catch((error) => {
                        errorHandler(error);
                      })
                      .finally(() => {
                        setIsLoadPrintDocument(false);
                      });
                  }}
                >
                  <Printer color="black" size={20} />
                </IconButton>
              ) : (
                <Spinner size="sm" style={{ color: 'blue' }} />
              )}
            </Tooltip>
            <Tooltip arrow title="Получить справку">
              <IconButton onClick={() => {}}>
                <QuestionCircle color="gray" size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </Col>
      </Row>

      <Row>
        <Form.Group className="mb-3" as={Row}>
          <Form.Label className="fs-6" column sm={2}>
            Врач
          </Form.Label>
          <Col sm={3} className="d-flex align-items-center justify-content-center">
            <Form.Control aria-label="text" value={visit?.doctor_full_name} size="sm" readOnly />
          </Col>
        </Form.Group>
        <Form.Group className="mb-3" as={Row}>
          <Form.Label className="fs-6" column sm={2}>
            Владелец животного
          </Form.Label>
          <Col sm={3} className="d-flex align-items-center justify-content-center">
            <Form.Control aria-label="text" value={visit?.owner_full_name} size="sm" readOnly />
          </Col>
        </Form.Group>
        <Row className="mb-3" as={Form.Group}>
          <Form.Label className="fs-6" column sm={2}>
            Кличка
          </Form.Label>
          <Col sm={2} className="d-flex align-items-center justify-content-center">
            <Form.Control aria-label="text" value={visit?.nickname} size="sm" readOnly />
          </Col>
        </Row>
        <Row className="mb-3" as={Form.Group}>
          <Form.Label className="fs-6" column sm={2}>
            Вид животного
          </Form.Label>
          <Col sm={2} className="d-flex align-items-center justify-content-center">
            <Form.Control aria-label="text" value={visit?.animal_name} size="sm" readOnly />
          </Col>
          <Form.Label className="fs-6" column sm={1}>
            Порода
          </Form.Label>
          <Col sm={3} className="d-flex align-items-center justify-content-center">
            <Form.Control aria-label="text" value={visit?.breed_name} size="sm" readOnly />
          </Col>
        </Row>
        <Row className="mb-3" as={Form.Group}>
          <Form.Label className="fs-6" column sm={2}>
            Возраст
          </Form.Label>
          <Col sm={2} className="d-flex align-items-center justify-content-center">
            <Form.Control aria-label="text" value={visit?.age} size="sm" readOnly />
          </Col>
          <Form.Label className="fs-6" column sm={1}>
            Пол
          </Form.Label>
          <Col sm={3} className="d-flex align-items-center justify-content-center">
            <Form.Control
              aria-label="text"
              value={visit?.gender === 1 ? 'Самец' : 'Самка'}
              size="sm"
              readOnly
            />
          </Col>
          <Form.Label className="fs-6" column sm={1}>
            Вес
          </Form.Label>
          <Col sm={3} className="d-flex align-items-center justify-content-center">
            <Form.Control aria-label="text" value={visit?.weight} size="sm" readOnly />
          </Col>
        </Row>
        <Row className="mb-3" as={Form.Group}>
          <Form.Label className="fs-6" column sm={2}>
            Анамнез
          </Form.Label>
          <Col sm={10} className="d-flex align-items-center justify-content-center">
            <Form.Control aria-label="text" value={visit?.anamnesis} size="sm" readOnly />
          </Col>
        </Row>

        <Row className="mb-3" as={Form.Group}>
          <Form.Label className="fs-6" column sm={2}>
            Обследование
          </Form.Label>
          <Col sm={10} className="d-flex align-items-center justify-content-center">
            <Form.Control aria-label="text" value={visit?.examination} size="sm" readOnly />
          </Col>
        </Row>

        <Row className="mb-3" as={Form.Group}>
          <Form.Label className="fs-6" column sm={3}>
            Предварительный диагноз
          </Form.Label>
          <Col sm={5} className="d-flex align-items-center justify-content-center">
            <AutoResizeTextarea
              value={visit?.prelim_diagnosis}
              onChange={(e: any) => {}}
              readOnly={true}
            />
          </Col>
        </Row>
        <Row className="mb-3" as={Form.Group}>
          <Form.Label className="fs-6" column sm={3}>
            Подтвержденный диагноз
          </Form.Label>
          <Col sm={5} className="d-flex align-items-center justify-content-center">
            <AutoResizeTextarea
              value={visit?.confirmed_diagnosis}
              onChange={(e: any) => {}}
              readOnly={true}
            />
          </Col>
        </Row>
        <Row className="mb-3" as={Form.Group}>
          <Form.Label className="fs-6" column sm={2}>
            Назначение
          </Form.Label>
          <Col sm={10} className="d-flex align-items-center justify-content-center">
            <AutoResizeTextarea value={visit?.result} onChange={(e: any) => {}} readOnly={true} />
          </Col>
        </Row>
        <Form.Group className="mb-3" as={Row}>
          <Form.Label className="fs-6" column sm={2}>
            Дата визита
          </Form.Label>
          <Col sm={2}>
            <Form.Control
              type="date"
              value={visit?.date_visit && visit.date_visit.substring(0, 10)}
              disabled
            />
          </Col>
        </Form.Group>

        {/* Добавьте сюда остальные поля формы с использованием visitData для отображения данных */}
        {/* <iframe
          src="https://mozilla.github.io/pdf.js/web/viewer.html"
          style={{ width: '718px', height: '700px' }}
        /> */}
      </Row>
    </Form>
  );
};

export default Visit;

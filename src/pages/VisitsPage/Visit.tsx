import { FC } from 'react';
import { Form, Row, Button, Col } from 'react-bootstrap';
import { Box, IconButton, Tooltip } from '@mui/material';
import { ArrowClockwise, Pencil, PlusLg, QuestionCircle, Trash } from 'react-bootstrap-icons';
import { userSlice } from '../../store/reducers/UserSlice/UserSlice';
import { useAppDispatch } from '../../hooks/redux';

interface Props {
  visit: any;
  isPrimary: boolean;
}

const Visit: FC<Props> = ({ visit, isPrimary }) => {
  const { setShowModalChangeVisit, setSelectedVisit, setIsReloadTable } = userSlice.actions;

  const dispatch = useAppDispatch();

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
            <Tooltip arrow title="Редактировать">
              <IconButton
                onClick={() => {
                  dispatch(setShowModalChangeVisit(true));
                  dispatch(setSelectedVisit(visit));
                }}
              >
                <Pencil color="green" size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Удалить">
              <IconButton
                onClick={() => {
                  //dispatch(setShowModalAddAnimalType(true));
                }}
              >
                <Trash color="red" size={20} />
              </IconButton>
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
        {/* Поля с описаниями */}
        {/* {[
          { label: 'Владелец', value: visit?.owner_full_name },
          { label: 'Кличка', value: visit?.nickname },
          { label: 'Вид животного', value: visit?.animal_name },
          { label: 'Порода', value: visit?.breed_name },
          { label: 'Возраст', value: visit?.age },
          { label: 'Пол', value: visit?.gender === 1 ? 'Самец' : 'Самка' },
          { label: 'Вес', value: visit?.weight },
          { label: 'Обследование', value: visit?.examination },
          { label: 'Предварительный диагноз', value: visit?.prelim_diagnosis },
          { label: 'Подтвержденный диагноз', value: visit?.confirmed_diagnosis },
          { label: 'Назначение', value: visit?.confirmed_diagnosis }, // Проверьте, это правильное поле
        ].map(({ label, value }, index) => (
          <Row className="mb-3" as={Form.Group} key={index}>
            <Form.Label className="fs-6" column sm={3}>
              {label}
            </Form.Label>
            <Col sm={9} className="d-flex align-items-center">
              <Form.Control aria-label={label} value={value} size="sm" readOnly />
            </Col>
          </Row>
        ))} */}
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
            <Form.Control aria-label="text" value={visit?.prelim_diagnosis} size="sm" readOnly />
          </Col>
        </Row>
        <Row className="mb-3" as={Form.Group}>
          <Form.Label className="fs-6" column sm={3}>
            Подтвержденный диагноз
          </Form.Label>
          <Col sm={5} className="d-flex align-items-center justify-content-center">
            <Form.Control aria-label="text" value={visit?.confirmed_diagnosis} size="sm" readOnly />
          </Col>
        </Row>
        <Row className="mb-3" as={Form.Group}>
          <Form.Label className="fs-6" column sm={2}>
            Назначение
          </Form.Label>
          <Col sm={10} className="d-flex align-items-center justify-content-center">
            <Form.Control aria-label="text" value={visit?.confirmed_diagnosis} size="sm" readOnly />
          </Col>
        </Row>

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

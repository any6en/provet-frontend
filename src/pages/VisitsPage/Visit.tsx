import { FC } from 'react';
import { Form, Row, Button, Col } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  patient: any;
  owner: any;
  visit: any;
  doctors: any[];
}

const Visit: FC<Props> = ({ patient, owner, visit, doctors }) => {
  return (
    <Form className="px-3">
      <Row>
        <Col sm={8} className="d-flex align-items-center justify-content-center"></Col>
        <Col sm={3} className="d-flex align-items-center justify-content-center" />
        <Col sm={1} className="d-flex align-items-center justify-content-right">
          <span className="pe-1">
            <Button variant="primary" type="submit">
              <EditIcon />
            </Button>
          </span>
          <span>
            <Button variant="danger" type="submit">
              <DeleteIcon />
            </Button>
          </span>
        </Col>
      </Row>

      <Row>
        <Form.Group className="mb-3" as={Row}>
          <Form.Label className="fs-6" column sm={2}>
            Владелец животного
          </Form.Label>
          <Col sm={3} className="d-flex align-items-center justify-content-center">
            <Form.Control
              aria-label="text"
              value={owner?.last_name + ' ' + owner?.first_name + ' ' + owner?.patronymic}
              size="sm"
              readOnly
            />
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
      </Row>
    </Form>
  );
};

export default Visit;

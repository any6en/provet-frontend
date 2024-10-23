import { FC } from 'react';
import { Form, Row, Button, Col } from 'react-bootstrap';

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

        <Form.Group controlId="patientName">
          <Form.Label>Пациент</Form.Label>
          <Form.Control type="text" value={patient?.nickname} readOnly />
        </Form.Group>
        {/* Добавьте сюда остальные поля формы с использованием visitData для отображения данных */}
      </Row>
      <Button variant="primary" type="submit">
        Сохранить
      </Button>
    </Form>
  );
};

export default Visit;

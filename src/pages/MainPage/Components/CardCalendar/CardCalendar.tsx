import { Badge, Col, Container, Row, Spinner } from 'react-bootstrap';
import { FC, useEffect, useState } from 'react';
import style from '../../MainPage.module.scss';
import Card from 'react-bootstrap/Card';

const CardCalendar: FC = () => {
  const [isPreload, setIsPreload] = useState<boolean>(false);
  const [reqData, setReqData] = useState<any>({});

  return (
    <Card className={`w-50 ${style.cardCalendar}`}>
      <Card.Body className="py-2">
        {isPreload ? (
          <Spinner variant="primary" />
        ) : (
          <div className={` ${style.metricBody}`}>
            <Row>
              <Col
                sm={3}
                className="d-flex align-items-center justify-content-center p-1"
                style={{ color: '#099' }}
              >
                Вчера
              </Col>
              <Col sm={1}></Col>
              <Col
                sm={3}
                className="d-flex align-items-center justify-content-center p-1"
                style={{ color: '#7083b9' }}
              >
                Сегодня
              </Col>
              <Col
                sm={5}
                className="d-flex align-items-center justify-content-center p-1"
                style={{ color: '#7083b9' }}
              >
                Выбрать период
              </Col>
            </Row>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CardCalendar;

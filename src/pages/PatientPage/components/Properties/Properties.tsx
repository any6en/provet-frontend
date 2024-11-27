import { FC, useState, useEffect } from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import config from '../../../../config/config';

interface Props {
  patient: any;
}

const Properties: FC<Props> = ({ patient }) => {
  const { patient_idParam } = useParams();

  const [data, setData] = useState<any>(null);

  const fetch = async () => {
    if (config.url_provet_api) {
      axios
        .get(`${config.url_provet_api}directories/patients/patient/info?id=${patient_idParam}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setData(response.data.response);
        })
        .catch(() => {});
    }
  };

  // При монтировании компонента
  useEffect(() => {
    fetch();
  }, []);

  return (
    <Form className="px-3 py-2">
      <Row>
        <Col sm={6}>
          <strong className="d-flex justify-content-center pb-3">Характеристики</strong>
          {data ? (
            <>
              <Row>
                <Col sm={6}>
                  <strong>Номер в базе</strong>
                </Col>
                <Col sm={6}>{data?.id}</Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <strong>Кличка</strong>
                </Col>
                <Col sm={6}>{data?.nickname}</Col>
              </Row>
              <hr />
              <Row>
                <Col sm={6}>
                  <strong>Пол</strong>
                </Col>
                <Col sm={6}>{data?.gender}</Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <strong>Вид</strong>
                </Col>
                <Col sm={6}>{data?.animal_type_name}</Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <strong>Порода</strong>
                </Col>
                <Col sm={6}>{data?.breed_name}</Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <strong>Окрас</strong>
                </Col>
                <Col sm={6}>{data?.color}</Col>
              </Row>
              <hr />
              <Row>
                <Col sm={6}>
                  <strong>Дата регистрации</strong>
                </Col>
                <Col sm={6}>{data?.created_at}</Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <strong>Дата рождения</strong>
                </Col>
                <Col sm={6}>{data?.date_birth}</Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <strong>Возраст</strong>
                </Col>
                <Col sm={6}>{data?.age}</Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <strong>Кастрировано</strong>
                </Col>
                <Col sm={6}>{data?.castrated}</Col>
              </Row>
            </>
          ) : (
            <span className="d-flex justify-content-center">
              <Spinner variant="primary" />
            </span>
          )}
        </Col>
        <Col sm={6}>
          <strong className="d-flex justify-content-center pb-3">Характеристики</strong>
          {data ? (
            <Row>
              <Col sm={6}>
                <strong>Номер в базе</strong>
              </Col>
              <Col sm={6}>{data?.id}</Col>
            </Row>
          ) : (
            <span className="d-flex justify-content-center">
              <Spinner variant="primary" />
            </span>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default Properties;

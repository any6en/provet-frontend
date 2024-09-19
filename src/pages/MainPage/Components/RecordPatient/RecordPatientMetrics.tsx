import { Col, Row, Spinner, Container } from 'react-bootstrap';
import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import style from '../../MainPage.module.scss';
import Card from 'react-bootstrap/Card';
import { Circle, CircleFill } from 'react-bootstrap-icons';

const RecordPatientMetrics: FC = () => {
  const [isPreload, setIsPreload] = useState<boolean>(false);
  const [reqData, setReqData] = useState<any>({});

  // const handleClickMetric = (value: string) => {};

  // const getMetrics = () => {
  //   if (URL_INM) {
  //     setIsPreload(true);
  //     axios
  //       .get(`${URL_INM}v1/dashboard/metrics/clients?area_id=${area_id}`, {
  //         headers: {
  //           'api-key': TOKEN,
  //           'Content-Type': 'application/json',
  //         },
  //       })
  //       .then((res) => {
  //         setReqData(res.data.response.dashboard.metrics.clients);
  //         setIsPreload(false);
  //       })
  //       .catch((error) => {
  //         if (error !== null && !error.text) {
  //           errorHandler(error);
  //         }
  //         setReqData({});
  //         setIsPreload(false);
  //       });
  //   }
  // };

  // useEffect(() => {
  //   getMetrics();
  // }, [area_id]);

  return (
    <Card className={`w-25 h-100 min-vw-300`}>
      <Card.Body className="py-2">
        <Row>
          <Col sm={12} className="align-self-center">
            <Card.Title className={`text-muted text-center p-3 ${style.recordClient}`}>
              Владельцы и пациенты
            </Card.Title>
          </Col>
          <Col sm={3} className="align-self-center">
            {/* <IconButton onClick={getMetrics} disabled={isPreload ? true : false}> 
                 <RefreshIcon />
              </IconButton> */}
          </Col>
        </Row>
        {isPreload ? (
          <Spinner variant="primary" />
        ) : (
          <div className={` ${style.clientBody}`}>
            <Row>
              <Col sm={10} className="d-flex align-items-center">
                <Col sm={1}></Col>
                <CircleFill size="7" color="green" />
                <Col sm={10} className="ps-3">
                  Клиенты
                </Col>
              </Col>
              <Col sm={1}>0</Col>
            </Row>
            <Row>
              <Col sm={10} className="d-flex align-items-center">
                <Col sm={1}></Col>
                <CircleFill size="7" color="#99ff99" />
                <Col sm={10} className="ps-3">
                  Новые клиенты
                </Col>
              </Col>
              <Col sm={1}>0</Col>
            </Row>
            <Row>
              <Col sm={10} className="d-flex align-items-center">
                <Col sm={1}></Col>
                <CircleFill size="7" color="#87cefa" />
                <Col sm={10} className="ps-3">
                  Пациенты
                </Col>
              </Col>
              <Col sm={1}>0</Col>
            </Row>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecordPatientMetrics;

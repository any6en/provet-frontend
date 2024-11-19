import { FC, useState, useEffect } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_RU } from 'material-react-table/locales/ru';
import { Breadcrumb, Button, Container, Form, Row, Col, Spinner } from 'react-bootstrap';
import { ArrowClockwise, PlusLg, QuestionCircle, Trash } from 'react-bootstrap-icons';
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { infoHandler } from '../../../../utils/alarmHandler';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { userSlice } from '../../../../store/reducers/UserSlice/UserSlice';
import { URL_PROVET_API } from '../../../../config/config';
import { formatDate, formatDateDMYDT } from '../../../../utils/dateFormatter';

interface Props {
  patient: any;
}

const Properties: FC<Props> = ({ patient }) => {
  const { patient_idParam } = useParams();

  const [data, setData] = useState<any>(null);

  const fetch = async () => {
    axios
      .get(`${URL_PROVET_API}directories/patients/patient/info?id=${patient_idParam}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setData(response.data.response);
      })
      .catch(() => {})
      .finally(() => {});
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
        </Col>
        <Col sm={6}>
          <strong className="d-flex justify-content-center pb-3">Характеристики</strong>
          <Row>
            <Col sm={6}>
              <strong>Номер в базе</strong>
            </Col>
            <Col sm={6}>{data?.id}</Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default Properties;

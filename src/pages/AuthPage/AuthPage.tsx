import { FC, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { NavLink, useNavigate } from 'react-router-dom';
import style from './AuthPage.module.scss';
import useForceUpdate from 'use-force-update';
import axios from 'axios';
import FormData from 'form-data';
import { globalUserSlice } from '../../store/reducers/GlobalUserSlice/GlobalUserSlice';
import { useAppDispatch } from '../../hooks/redux';
import User from '../../utils/User';
import { URL_PROVET } from '../../config/config';
import { errorHandler } from '../../utils/alarmHandler';

const AuthPage: FC = () => {
  const user = new User();
  const inputRefLogin = useRef<HTMLInputElement>(null);
  const inputRefPassword = useRef<HTMLInputElement>(null);
  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { setGlobalUser } = globalUserSlice.actions;
  const navigate = useNavigate();
  const forceUpdate = useForceUpdate();
  const [refresh, isRefresh] = useState<boolean>(false);

  // Состояние для хранения измененных данных в форме
  const [data, setData] = useState<any>({});

  useEffect(() => {
    forceUpdate();
    if (user.isAuth()) {
      navigate('/');
    }
    isRefresh(false);
  }, [refresh]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (data.login === undefined) {
      let form = new FormData();
      form.append('username', inputRefLogin.current?.value);
      form.append('password', inputRefPassword.current?.value);

      setData(form);
    }

    setIsBtnDisabled(true);
    axios
      .post(`${URL_PROVET}auth/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        user.saveUser(res.data.response);
        dispatch(setGlobalUser(user));
        isRefresh(true);
      })
      .catch((error) => {
        if (error) {
          errorHandler(error);
        }
      })
      .finally(() => {
        setIsBtnDisabled(false);
      });
  };

  return (
    <Container
      fluid
      className={`d-flex flex-column justify-content-center align-items-center ${style.container}`}
    >
      <Form noValidate onSubmit={handleSubmit} className={`border rounded p-3 ${style.form}`}>
        <Row className="border-bottom " style={{ color: '#099', fontSize: 'large' }}>
          <span className="h10 mb-3 d-flex justify-content-center">ПроВет</span>
        </Row>
        <Row className="p-0 ps-3 pt-3">
          <Form.Group className="mb-3" as={Row}>
            <Form.Label className="fs-6" column sm={4}>
              Логин
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                value={data?.login}
                onChange={(e: any) => {
                  setData({
                    ...data,
                    login: e.target.value,
                  });
                }}
              />
            </Col>
          </Form.Group>
          <Form.Group className="mb-3" as={Row}>
            <Form.Label className="fs-6" column sm={4}>
              Пароль
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                required
                type="password"
                value={data?.password}
                onChange={(e: any) => {
                  setData({
                    ...data,
                    password: e.target.value,
                  });
                }}
              />
            </Col>
          </Form.Group>
        </Row>
        <Row className="border-top pt-3">
          <Col className="d-flex align-items-center justify-content-end flex-nowrap">
            <NavLink className="nav nav-item nav-link" aria-current="page" to="/">
              Забыли пароль?
            </NavLink>
            <Button
              className="px-3"
              variant="primary"
              type="submit"
              disabled={isBtnDisabled === true && true}
            >
              Войти
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AuthPage;

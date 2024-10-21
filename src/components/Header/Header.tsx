import { FC } from 'react';
import style from './Header.module.scss';
import { Row, Col, Container, Image, NavDropdown, Nav, Dropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { DoorOpen, Folder2Open, Search } from 'react-bootstrap-icons';
import { useAppSelector } from '../../hooks/redux';
import { avatarEmpty } from '../../utils/Avatar';
import ScienceIcon from '@mui/icons-material/Science';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';

const Header: FC = () => {
  const user = useAppSelector((state) => state.globalUserReducer.globalUser);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="header p-1" style={{ backgroundColor: '#099' }}>
      <Container fluid>
        <Row className="d-flex align-items-center justify-content-center flex-nowrap">
          <Col
            sm={2}
            className="p-0 d-flex align-items-center justify-content-start"
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            <Image src={require('./logo.png')} className={`${style.logo}`} />
          </Col>
          <Col sm={8} className="d-flex align-items-center p-0">
            <Nav.Link as={NavLink} to="/go">
              <EditIcon viewBox="0 0 20 20" sx={{ color: 'white' }} />
              <span style={{ color: '#fff' }}>Вести прием</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/search_patients">
              <SearchIcon viewBox="0 0 20 20" sx={{ color: 'white' }} />
              <span style={{ color: '#fff' }}>Поиск</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/laboratory">
              <ScienceIcon viewBox="0 0 20 20" sx={{ color: 'white' }} />
              <span style={{ color: '#fff' }}>Лаборатория</span>
            </Nav.Link>
            <NavDropdown
              title={
                <>
                  <LibraryBooksIcon viewBox="0 0 20 20" sx={{ color: 'white' }} />{' '}
                  <span style={{ color: '#fff' }}>Справочники</span>
                </>
              }
              className="p-2"
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item className="text-dark">
                <NavLink className="nav-link" aria-current="page" to="directories/owners">
                  <div className="d-inline-flex align-items-center justify-content-center text-dark">
                    Владельцы
                  </div>
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item className="text-dark">
                <NavLink className="nav-link" aria-current="page" to="directories/patients">
                  <div className="d-inline-flex align-items-center justify-content-center text-dark">
                    Пациенты
                  </div>
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item className="text-dark">
                <NavLink className="nav-link" aria-current="page" to="directories/animal_types">
                  <div className="d-inline-flex align-items-center justify-content-center text-dark">
                    Виды животных
                  </div>
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item className="text-dark">
                <NavLink className="nav-link" aria-current="page" to="directories/breeds">
                  <div className="d-inline-flex align-items-center justify-content-center text-dark">
                    Породы
                  </div>
                </NavLink>
              </NavDropdown.Item>
            </NavDropdown>
          </Col>
          <Col sm={2}>
            <Row className="row d-flex  align-items-center">
              <Col className="col d-flex flex-row justify-content-end p-0">
                <div className="d-flex align-items-center">
                  <div className="d-flex  justify-content-end text-muted">
                    <span>{user.lastName}&nbsp;</span>
                    <span className="d-flex">
                      {user && user.firstName[0]}
                      &nbsp;
                      {user.patronymic[0]}
                    </span>
                  </div>
                  <div className="d-flex justify-content-end p-0 ms-1">
                    <NavDropdown
                      title={
                        <div className={` d-flex justify-content-center`}>
                          <Image
                            src={user.avatar}
                            alt="Аватар пользователя"
                            style={{
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                            className={`border border-3 align-self-center ${style.avatar}`}
                          />
                        </div>
                      }
                      id="basic-nav-dropdown"
                      className={style.dropdownToggle}
                    >
                      <Container>
                        <Row className="border-bottom m-1 text-center">
                          <Col>
                            <span>
                              {user.lastName} {user.firstName} {user.patronymic}
                            </span>
                            <br />
                            <span className="text-muted">{user.email}</span>
                          </Col>
                        </Row>
                        <Row>
                          <NavDropdown.Item>
                            <span
                              className="nav-link d-flex align-items-center"
                              onClick={handleLogout}
                            >
                              <DoorOpen color="gray" size={20} className="me-2" />
                              Выйти
                            </span>
                          </NavDropdown.Item>
                        </Row>
                      </Container>
                    </NavDropdown>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;

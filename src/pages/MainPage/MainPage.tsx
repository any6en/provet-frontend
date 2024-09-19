import { FC } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const MainPage: FC = () => {
  return (
    <>
      <Container fluid className="py-2">
        <Breadcrumb style={{ backgroundColor: '#f5f5f5' }} className="p-2">
          <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
        </Breadcrumb>

        <Link to="reception/">
          <Container fluid className="d-flex justify-content-center">
            <PlusCircle size={45} color="#099" style={{ cursor: 'pointer' }} />
          </Container>
          <Container fluid className="d-flex justify-content-center">
            <div className="reception">Начать вести прием</div>
          </Container>
        </Link>
      </Container>
    </>
  );
};

export default MainPage;

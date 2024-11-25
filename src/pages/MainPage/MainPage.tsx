import { FC } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';

const MainPage: FC = () => {
  return (
    <>
      <Container fluid className="py-2">
        <Breadcrumb style={{ backgroundColor: '#f5f5f5' }} className="p-2">
          <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
        </Breadcrumb>
      </Container>
    </>
  );
};

export default MainPage;

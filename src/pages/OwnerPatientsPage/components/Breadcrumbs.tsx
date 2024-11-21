import { FC } from 'react';
import { Breadcrumb, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbProps {
  ownerId: string;
  isLoadMatrix: boolean;
}

const Breadcrumbs: FC<BreadcrumbProps> = ({ ownerId, isLoadMatrix }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb className="p-2">
      <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
      <Breadcrumb.Item onClick={() => navigate(`/search_owners`)}>Быстрый поиск</Breadcrumb.Item>
      <Breadcrumb.Item active>
        Владелец пациентов №{ownerId} {isLoadMatrix && <Spinner variant="primary" size="sm" />}
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default Breadcrumbs;

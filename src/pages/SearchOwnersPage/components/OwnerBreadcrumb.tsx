import { FC } from 'react';
import { Breadcrumb, Spinner } from 'react-bootstrap';

interface OwnerBreadcrumbProps {
  isLoadMatrix: boolean;
}

const OwnerBreadcrumb: FC<OwnerBreadcrumbProps> = ({ isLoadMatrix }) => {
  return (
    <Breadcrumb className="p-2">
      <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
      <Breadcrumb.Item active>
        Быстрый поиск {isLoadMatrix && <Spinner variant="primary" size="sm" />}
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default OwnerBreadcrumb;

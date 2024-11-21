import { FC } from 'react';
import { Breadcrumb, Spinner } from 'react-bootstrap';

interface BreadcrumbsProps {
  isLoadMatrix: boolean;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ isLoadMatrix }) => {
  return (
    <Breadcrumb className="p-2">
      <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
      <Breadcrumb.Item active>
        Быстрый поиск {isLoadMatrix && <Spinner variant="primary" size="sm" />}
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default Breadcrumbs;

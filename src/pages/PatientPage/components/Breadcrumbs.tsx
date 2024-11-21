import { FC } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbProps {
  patient: any;
}

const Breadcrumbs: FC<BreadcrumbProps> = ({ patient }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb className="p-2">
      <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
      <Breadcrumb.Item
        onClick={() => {
          navigate('/search_owners');
        }}
      >
        Быстрый поиск
      </Breadcrumb.Item>
      <Breadcrumb.Item
        onClick={() => {
          navigate(`/patients_of_owner/${patient?.owner_id}`);
        }}
      >
        Владелец пациентов №{patient?.owner_id}
      </Breadcrumb.Item>

      <Breadcrumb.Item active>Пациент №{patient?.id}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default Breadcrumbs;

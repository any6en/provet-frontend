import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { formatDateDMYDT } from '../../../utils/dateFormatter';

interface BreadcrumbsProps {
  visits: any;
}

const BreadcrumbsLoL: React.FC<BreadcrumbsProps> = ({ visits }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb className="p-2">
      <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
      <Breadcrumb.Item onClick={() => navigate('/search_owners')}>Быстрый поиск</Breadcrumb.Item>
      <Breadcrumb.Item onClick={() => navigate(`/patients_of_owner/${visits?.owner_id}`)}>
        Владелец пациентов №{visits?.owner_id}
      </Breadcrumb.Item>
      <Breadcrumb.Item onClick={() => navigate(`/patient/${visits?.patient_id}`)}>
        Пациент №{visits?.patient_id}
      </Breadcrumb.Item>
      <Breadcrumb.Item active>
        Прием(-ы) от {formatDateDMYDT(visits?.date_visit, false, true)}
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadcrumbsLoL;

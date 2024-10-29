import { FC, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import User from '../../utils/User';

const LogoutPage: FC = () => {
  const user = useAppSelector((state) => state.globalUserReducer.globalUser);
  const navigate = useNavigate();

  useEffect(() => {
    User.logout();
    navigate('/');
  }, []);

  return <></>;
};
export default LogoutPage;

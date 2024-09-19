import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import PatientsPage from '../pages/PatientsPage/PatientsPage';
import OwnersPage from '../pages/OwnersPage/OwnersPage';
import MainPage from '../pages/MainPage/MainPage';
import { useAppDispatch } from '../hooks/redux';
import { globalUserSlice } from '../store/reducers/GlobalUserSlice/GlobalUserSlice';
import User from '../utils/User';
import { useEffect } from 'react';
import AuthPage from '../pages/AuthPage/AuthPage';
import LogoutPage from '../pages/LogoutPage/LogoutPage';
import BreedsPage from '../pages/BreedsPage/BreedsPage';
import SpeciesPage from '../pages/SpeciesPage/SpeciesPage';
import ReceptionPage from '../pages/ReceptionPage/ReceptionPage';
import PatientPage from '../pages/PatientPage/PatientPage';
import SearchPatientsPage from '../pages/SearchPatients/SearchPatients';

function Root() {
  const dispatch = useAppDispatch();
  const { setGlobalUser } = globalUserSlice.actions;
  const navigate = useNavigate();
  let location = useLocation();
  const user = new User();
  dispatch(setGlobalUser(user));

  useEffect(() => {
    if (!user.isAuth() && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [location, user.isAuth()]);

  return (
    <Routes>
      {user.isAuth() && (
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          {/* Главные справочники */}
          <Route path="owners" element={<OwnersPage />} />
          <Route path="patients" element={<PatientsPage />} />
          {/* Дополнительные справочники */}
          <Route path="species" element={<SpeciesPage />} />
          <Route path="breeds" element={<BreedsPage />} />
          <Route path="/patient/:id" element={<PatientPage />} />
          <Route path="reception" element={<ReceptionPage />} />
          <Route path="search_patients" element={<SearchPatientsPage />} />
        </Route>
      )}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Root;

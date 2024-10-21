import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

import MainPage from '../pages/MainPage/MainPage';
import { useAppDispatch } from '../hooks/redux';
import { globalUserSlice } from '../store/reducers/GlobalUserSlice/GlobalUserSlice';
import User from '../utils/User';
import { useEffect } from 'react';
import AuthPage from '../pages/AuthPage/AuthPage';
import LogoutPage from '../pages/LogoutPage/LogoutPage';

import PatientsPage from '../pages/Directories/PatientsPage/PatientsPage';
import OwnersPage from '../pages/Directories/OwnersPage/OwnersPage';
import BreedsPage from '../pages/Directories/BreedsPage/BreedsPage';
import AnimalTypesPage from '../pages/Directories/AnimalTypesPage/AnimalTypesPage';

import PatientPage from '../pages/PatientPage/PatientPage';
import SearchPatientsPage from '../pages/SearchPatients/SearchPatients';
import OwnerPatientsPage from '../pages/OwnerPatientsPage/OwnerPatientsPage';

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
          <Route path="directories/owners" element={<OwnersPage />} />
          <Route path="directories/patients" element={<PatientsPage />} />
          {/* Дополнительные справочники */}
          <Route path="directories/animal_types" element={<AnimalTypesPage />} />
          <Route path="directories/breeds" element={<BreedsPage />} />

          <Route path="/patient/:id" element={<PatientPage />} />
          <Route path="search_patients" element={<SearchPatientsPage />} />

          <Route path="patients/:owner_idParam?" element={<OwnerPatientsPage />} />
        </Route>
      )}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Root;

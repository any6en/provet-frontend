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

import PatientPage from '../pages/PatientPage/PatientPage';
import OwnerPatientsPage from '../pages/OwnerPatientsPage/OwnerPatientsPage';
import VisitsPage from '../pages/VisitsPage/VisitsPage';
import SearchOwnersPage from '../pages/SearchOwnersPage/SearchOwnersPage';

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
          {/* Главные справочники
          <Route path="directories/owners" element={<OwnersPage />} />
          <Route path="directories/patients" element={<PatientsPage />} />
          <Route path="directories/animal_types" element={<AnimalTypesPage />} />
          <Route path="directories/breeds" element={<BreedsPage />} /> */}

          {/* Вет. дело */}
          <Route path="search_owners" element={<SearchOwnersPage />} />

          <Route path="patient/:patient_idParam" element={<PatientPage />} />
          <Route path="patients_of_owner/:owner_idParam?" element={<OwnerPatientsPage />} />
          {/* <Route path="primary_visits/:primary_visit_idParam?" element={<PrimaryVisitPage />} /> */}
          <Route path="visits/:primary_visit_idParam?" element={<VisitsPage />} />
        </Route>
      )}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Root;

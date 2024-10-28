import { Outlet } from 'react-router';
import Header from '../Header/Header';

import ModalChangeOwner from '../../pages/Directories/OwnersPage/ModalChangeOwner/ModalChangeOwner';
import ModalAddOwner from '../../pages/Directories/OwnersPage/ModalAddOwner/ModalAddOwner';

import ModalChangePatient from '../../pages/Directories/PatientsPage/ModalChangePatient/ModalChangePatient';
import ModalAddPatient from '../../pages/Directories/PatientsPage/ModalAddPatient/ModalAddPatient';

import ModalChangeBreed from '../../pages/Directories/BreedsPage/ModalChangeBreed/ModalChangeBreed';
import ModalAddBreed from '../../pages/Directories/BreedsPage/ModalAddBreed/ModalAddBreed';

import ModalChangeAnimalType from '../../pages/Directories/AnimalTypesPage/ModalChangeAnimalType/ModalChangeAnimalType';
import ModalAddAnimalType from '../../pages/Directories/AnimalTypesPage/ModalAddAnimalType/ModalAddAnimalType';

import ModalAddRepeatVisit from '../../pages/VisitsPage/components/ModalAddRepeatVisit/ModalAddRepeatVisit';
import ModalChangePrimaryVisit from '../../pages/VisitsPage/components/ModalChangePrimaryVisit/ModalChangePrimaryVisit';
import ModalChangeRepeatVisit from '../../pages/VisitsPage/components/ModalChangeRepeatVisit/ModalChangeRepeatVisit';
import ModalAddPrimaryVisit from '../../pages/VisitsPage/components/ModalAddPrimaryVisit/ModalAddPrimaryVisit';

function Layout() {
  return (
    <>
      <main>
        <Header />
        <Outlet />
        <ModalChangeOwner />
        <ModalAddOwner />
        <ModalChangePatient />
        <ModalAddPatient />
        <ModalChangeBreed />
        <ModalAddBreed />
        <ModalChangeAnimalType />
        <ModalAddAnimalType />

        {/* Приемы */}
        <ModalAddRepeatVisit />
        <ModalChangeRepeatVisit />
        <ModalAddPrimaryVisit />
        <ModalChangePrimaryVisit />
        {/* Приемы */}
      </main>
      <footer>{/* <Footer /> */}</footer>
    </>
  );
}

export default Layout;

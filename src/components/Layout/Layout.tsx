import { Outlet } from 'react-router';
import Header from '../Header/Header';

import ModalAddRepeatVisit from '../../pages/VisitsPage/components/ModalRepeatVisit/ModalAddRepeatVisit/ModalAddRepeatVisit';
import ModalChangePrimaryVisit from '../../pages/VisitsPage/components/ModalPrimaryVisit/ModalChangePrimaryVisit/ModalChangePrimaryVisit';
import ModalChangeRepeatVisit from '../../pages/VisitsPage/components/ModalRepeatVisit/ModalChangeRepeatVisit/ModalChangeRepeatVisit';
import ModalAddPrimaryVisit from '../../pages/VisitsPage/components/ModalPrimaryVisit/ModalAddPrimaryVisit/ModalAddPrimaryVisit';
import ModalChangeOwner from '../../pages/Directories/OwnersPage/ModalChangeOwner/ModalChangeOwner';
import ModalAddOwner from '../../pages/Directories/OwnersPage/ModalAddOwner/ModalAddOwner';
import ModalChangePatient from '../../pages/Directories/PatientsPage/ModalChangePatient/ModalChangePatient';
import ModalAddPatient from '../../pages/Directories/PatientsPage/ModalAddPatient/ModalAddPatient';
import ModalChangeBreed from '../../pages/Directories/BreedsPage/ModalChangeBreed/ModalChangeBreed';
import ModalAddBreed from '../../pages/Directories/BreedsPage/ModalAddBreed/ModalAddBreed';
import ModalAddAnimalType from '../../pages/Directories/AnimalTypesPage/ModalAddAnimalType/ModalAddAnimalType';
import ModalChangeAnimalType from '../../pages/Directories/AnimalTypesPage/ModalChangeAnimalType/ModalChangeAnimalType';

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

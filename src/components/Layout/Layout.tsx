import { Outlet } from 'react-router';
import SideBar from '../SideBar/SideBar';
import styles from './Layout.module.scss';
import { Container } from 'react-bootstrap';
import Footer from '../Footer';
import ModalChangeOwner from '../../pages/OwnersPage/ModalChangeOwner/ModalChangeOwner';
import Header from '../Header/Header';
import ModalAddOwner from '../../pages/OwnersPage/ModalAddOwner/ModalAddOwner';
import ModalChangePatient from '../../pages/PatientsPage/ModalChangePatient/ModalChangePatient';
import ModalAddPatient from '../../pages/PatientsPage/ModalAddPatient/ModalAddPatient';
import ModalChangeBreed from '../../pages/BreedsPage/ModalChangeBreed/ModalChangeBreed';
import ModalAddBreed from '../../pages/BreedsPage/ModalAddBreed/ModalAddBreed';
import ModalChangeSpecie from '../../pages/SpeciesPage/ModalChangeSpecie/ModalChangeSpecie';
import ModalAddSpecie from '../../pages/SpeciesPage/ModalAddSpecie/ModalAddSpecie';

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

        <ModalChangeSpecie />
        <ModalAddSpecie />
      </main>
      <footer>{/* <Footer /> */}</footer>
    </>
  );
}

export default Layout;

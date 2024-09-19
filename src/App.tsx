import { RouterProvider } from 'react-router-dom';
import router from './routing/router';

import './App.scss';
import setupInterceptors from './utils/axiosInterceptors';

const App: React.FC = () => {
  setupInterceptors();

  return <RouterProvider router={router} />;
};

export default App;

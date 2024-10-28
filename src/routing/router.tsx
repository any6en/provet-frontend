import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';

const router = createBrowserRouter([{ path: '/*', element: <Root /> }], { basename: '/' });

export default router;

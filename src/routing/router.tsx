import { createHashRouter } from 'react-router-dom';
import Root from './Root';

const router = createHashRouter([{ path: '/*', Component: Root }], { basename: '/' });

export default router;

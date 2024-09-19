import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { ThemeProvider } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { setupStore } from './store/store';

const store = setupStore();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>,
);
import axios from 'axios';
import { returnErrors } from './alarmHandler';

const setupInterceptors = () => {
  //   //Автоматически добавляем заголовки к запросам
  //   axios.interceptors.request.use((config) => {
  //     const user = new User();
  //     config.headers['session-uid'] = user.session_uid;

  //     return config;
  //   });

  // Обработка ответов
  axios.interceptors.response.use(
    // Обработка успешного запроса от сервера (200-е)
    function (response) {
      return response;
    },
    // Обработка неуспешного запроса от сервера (400-е)
    function (error) {
      if (error?.response || error?.message) {
        const res: string | null = returnErrors(error);
        return Promise.reject(res);
      }
      return Promise.reject(error);
    },
  );
};

export default setupInterceptors;

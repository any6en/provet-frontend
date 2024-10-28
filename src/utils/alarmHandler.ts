import Swal from 'sweetalert2';
import User from './User';

export const returnErrors = (error: any) => {
  let status: number = error?.response?.status;
  if (!status) {
    if (error?.message === 'Network Error') {
      errorHandler('Ошибка соединения с сервером');
    }
    return null;
  }

  if (status === 401) {
    User.logout();
    errorHandler('Ошибка авторизации');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return null;
  }

  if (status === 403 || status === 429) {
    errorHandler('Доступ к запрошенному ресурсу запрещен');
    return null;
  }

  if (status === 400) {
    const errors: any = error?.response?.data;
    return errors.response.errors;
  }

  if (status >= 500) {
    errorHandler('Критическая ошибка приложения');
    return null;
  }

  errorHandler(`Невозможно разобрать ответ сервера, код ${status}.`);

  return null;
};

export const errorHandler = (text: string) => {
  alarmHandler('error', text);
};

export const successHandler = (text: string) => {
  alarmHandler('success', text);
};

export const alertHandler = (text: string) => {
  alarmHandler('warning', text);
};

export const infoHandler = (text: string) => {
  alarmHandler('info', text);
};

const alarmHandler = (type: string, text: string) => {
  // @ts-ignore
  Swal.fire({
    icon: type,
    title: text,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
};

import axios from 'axios';
import { URL_PROVET_API } from '../config/config';
import { errorHandler } from './alarmHandler';

export default class ProvetAPI {
  /* 
    Запрос к ProvetAPI.
    controller - .
  */
  /**
   *
   * @param path
   * @param controller контроллер для управления прерываниями axios запроса
   * @param showError
   * @returns
   */
  async getList(path: string, controller?: AbortController, showError: boolean = true) {
    try {
      const resp = await axios.get(`${URL_PROVET_API}directories/${path}`, {
        signal: controller?.signal,
      });

      return await resp.data.response;
    } catch (error: any) {
      if (error && showError) {
        errorHandler(error);
      }
    }
  }
}

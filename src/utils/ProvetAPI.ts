import axios from 'axios';
import { errorHandler } from './alarmHandler';
import config from '../config/config';

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
    if (config.url_provet_api) {
      try {
        const resp = await axios.get(`${config.url_provet_api}directories/${path}`, {
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
}

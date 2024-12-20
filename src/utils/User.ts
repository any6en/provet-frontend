//@ts-nocheck
import { avatarEmpty } from './Avatar';
import { IUser } from './UserTypes.ts';

export default class User {
  id: string;
  login: string;
  email: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  avatar: string;
  role: string;

  constructor() {
    let user = this.#getUser();
    this.id = user.id;
    this.login = user.login;
    this.email = user.email;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.patronymic = user.patronymic;
    this.avatar = user.avatar ? user.avatar : avatarEmpty;
    this.role = user.role;
  }

  saveUser(userData: IUser) {
    localStorage.setItem('userProfile', JSON.stringify(userData));
  }

  #getUser() {
    let userProfile = localStorage.getItem('userProfile') || {};
    try {
      return JSON.parse(userProfile);
    } catch (e) {
      return {};
    }
  }

  /**
   * Проверка имеет ли пользователь роль role
   * @param role string
   * @returns boolean
   */
  hasRole(role: string): boolean {
    return this.role === role;
  }

  isAuth() {
    return this.email !== undefined && this.email !== '';
  }

  static logout() {
    localStorage.removeItem('userProfile');
  }
}

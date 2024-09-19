//@ts-nocheck
import { IUser } from './UserTypes.ts';

export default class User {
  id: string;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  avatar: string;
  role: string;

  constructor() {
    let user = this.#getUser();
    this.id = user.id;
    this.login = user.login;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.patronymic = user.patronymic;
    this.avatar = user.avatar;
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

  isAuth() {
    return this.email !== undefined && this.email !== '';
  }

  static logout() {
    localStorage.removeItem('userProfile');
  }
}

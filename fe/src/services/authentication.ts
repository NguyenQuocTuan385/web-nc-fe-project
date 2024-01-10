import { LoginRequest } from "models/authentication";
import { apiAuth } from "./configApi";
import { API } from "config/constant";
import { GetUsers, UserRequest } from "models/user";

export class AuthenticationService {
  static async login(data: LoginRequest): Promise<any> {
    return await apiAuth
      .post(`${API.AUTH.LOGIN}`, data, { withCredentials: true })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async register(data: UserRequest): Promise<any> {
    return await apiAuth
      .post(`${API.AUTH.REGISTER}`, data, { withCredentials: true })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async refresh(): Promise<any> {
    return await apiAuth
      .post(`${API.AUTH.REFRESH}`, { withCredentials: true })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async logout(): Promise<any> {
    return await apiAuth
      .get(`${API.AUTH.LOGOUT}`, { withCredentials: true })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

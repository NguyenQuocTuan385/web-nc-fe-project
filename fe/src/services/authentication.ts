import { LoginRequest } from "models/authentication";
import api from "./configApi";
import { API } from "config/constant";

export class AuthenticationService {
  static async login(data: LoginRequest): Promise<any> {
    return await api
      .post(`${API.AUTH.LOGIN}`, data, { withCredentials: true })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async refresh(): Promise<any> {
    return await api
      .post(`${API.AUTH.REFRESH}`, { withCredentials: true })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

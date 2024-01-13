import { API } from "config/constant";
import { GetUsers, UserRequest, RequestOTPUser } from "models/user";
import api from "./configApi";

export class Userservice {
  static async getUsers(data: GetUsers, api: any): Promise<any> {
    return await api
      .get(`${API.USER.DEFAULT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getUserbyId(id: Number, api: any): Promise<any> {
    return await api
      .get(`${API.USER.DETAIL.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateUser(id: Number, userRequest: UserRequest, api: any): Promise<any> {
    return await api
      .put(`${API.USER.UPDATE.replace(":id", `${id}`)}`, userRequest)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteUser(id: Number, api: any): Promise<any> {
    return await api
      .delete(`${API.USER.DELETE.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async checkOTP(data: RequestOTPUser): Promise<any> {
    return await api
      .post(`${API.USER.CHECK_OTP}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default Userservice;

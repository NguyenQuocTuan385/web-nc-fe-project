import { API } from "config/constant";
import api from "./configApi";
import { User, GetUsers, UserRequest } from "models/user";

export class Userservice {
  static async getUsers(data: GetUsers): Promise<any> {
    return await api
      .get(`${API.USER.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getUserbyId(id: Number): Promise<any> {
    return await api
      .get(`${API.USER.DETAIL.replace(":id", `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateUser(id: Number, userRequest: UserRequest): Promise<any> {
    return await api
      .put(`${API.USER.UPDATE.replace(":id", `${id}`)}`, userRequest)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteUser(id: Number): Promise<any> {
    return await api
      .delete(`${API.USER.DELETE.replace(":id", `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default Userservice;

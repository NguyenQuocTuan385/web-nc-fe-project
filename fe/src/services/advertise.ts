import { API } from "config/constant";
import api from "./configApi";
import { GetAdvertises, UpdateAdvertise, UpdateAdvertiseStatus, UpdateStatus } from "models/advertise";

export class AdvertiseService {
  static async getAdvertisesByLocationId(id: number, data: GetAdvertises): Promise<any> {
    return await api
      .get(`${API.ADVERTISE.DEFAULT.replace(":id", `${id}`)}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateAdvertiseLicense(id: number, data: UpdateAdvertiseStatus): Promise<any> {
    return await api
      .put(`${API.ADVERTISE.UPDATE_LICENSE.replace(":id", `${id}`)}`, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getAllUnauthorizedAdvertisement(data: GetAdvertises): Promise<any> {
    return await api
      .get(`${API.ADVERTISE.GET_ALL_UNAUTHORIZED}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getAdvertisesById(id: number): Promise<any> {
    return await api
      .get(`${API.ADVERTISE.GET_BY_ID.replace(":id", `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateStatus(id: number, data: UpdateStatus): Promise<any> {
    return await api
      .put(`${API.ADVERTISE.UPDATE_STATUS.replace(":id", `${id}`)}`, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateAdvertise(id: number, data: UpdateAdvertise): Promise<any> {
    return await api
      .put(`${API.ADVERTISE.UPDATE.replace(":id", `${id}`)}`, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteAdvertiseEditById(id: number): Promise<any> {
    return await api
      .delete(`${API.ADVERTISE.DELETE_ADVERTISE_EDIT.replace(":id", `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default AdvertiseService;

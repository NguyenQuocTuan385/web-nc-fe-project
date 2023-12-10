import { API } from "config/constans";
import { GetApikeysParams } from "models/Admin/apikey";
import { ApikeyFormData } from "pages/Admin/ApiKey/Create";
import api from "services/configApi";

export class AdminApikeyService {
  static async getApikeys(data: GetApikeysParams): Promise<any> {
    return await api
      .get(API.ADMIN.APIKEY.DEFAULT, {
        params: data,
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getApikey(id: number): Promise<any> {
    return await api
      .get(`${API.ADMIN.APIKEY.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async create(data: ApikeyFormData): Promise<any> {
    return await api.post(API.ADMIN.APIKEY.DEFAULT, data)
      .then((res) => {
        
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async update(id: number, data: ApikeyFormData): Promise<any> {
    return await api.put(`${API.ADMIN.APIKEY.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.APIKEY.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

import { API } from 'config/constans';
import { CreateQuotaTableParams, GetQuotaTablesParams, UpdateQuotaTableParams } from 'models/Admin/quota';
import api from 'services/configApi';

export class AdminQuotaService {

  static async getQuotaTables(data: GetQuotaTablesParams): Promise<any> {
    return await api.get(API.ADMIN.QUOTA.TABLE.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getQuotaTable(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.QUOTA.TABLE.DEFAULT}/${id}`, {
      params: {
        language
      }
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async createQuotaTable(data: CreateQuotaTableParams): Promise<any> {
    return await api.post(API.ADMIN.QUOTA.TABLE.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateQuotaTable(id: number, data: UpdateQuotaTableParams): Promise<any> {
    return await api.put(`${API.ADMIN.QUOTA.TABLE.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async deleteQuotaTable(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.QUOTA.TABLE.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }


}

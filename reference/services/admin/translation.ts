import { API } from 'config/constans';
import { CreateTranslation, GetTranslations, UpdateTranslation } from 'models/Admin/translation';
import api from 'services/configApi';

export class TranslationService {

  static async getTranslations(data: GetTranslations): Promise<any> {
    return await api.get(API.ADMIN.TRANSLATION.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getTranslation(id: number): Promise<any> {
    return await api.get(`${API.ADMIN.TRANSLATION.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async create(data: CreateTranslation): Promise<any> {
    return await api.post(API.ADMIN.TRANSLATION.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateTranslation): Promise<any> {
    return await api.put(`${API.ADMIN.TRANSLATION.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.TRANSLATION.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }


}

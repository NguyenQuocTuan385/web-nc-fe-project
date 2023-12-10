import { API } from 'config/constans';
import { GetPacks } from 'models/pack';
import api from 'services/configApi';

export class PackService {
  static async getPacks(data: GetPacks) {
    return await api.get(API.PACK.DEFAULT, {
      params: data
    })
    .then((res) => {
      return Promise.resolve(res.data)
    })
    .catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  }
  static async create(data: FormData): Promise<any> {
    return await api.post(`${API.PACK.DEFAULT}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async update(id: number, data: FormData): Promise<any> {
    return await api.put(`${API.PACK.DEFAULT}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.PACK.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

}

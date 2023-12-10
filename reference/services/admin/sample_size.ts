import { API } from 'config/constans';
import { GetListSampleSize, CreateSampleSize, UpdateSampleSize } from 'models/Admin/sample_size';
import api from 'services/configApi';

export class AdminSampleSizeService {

  static async getList(data: GetListSampleSize): Promise<any> {
    return await api.get(API.ADMIN.SAMPLE_SIZE.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getDetail(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.SAMPLE_SIZE.DEFAULT}/${id}`, {
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

  static async create(data: CreateSampleSize): Promise<any> {
    return await api.post(API.ADMIN.SAMPLE_SIZE.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateSampleSize): Promise<any> {
    return await api.put(`${API.ADMIN.SAMPLE_SIZE.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.SAMPLE_SIZE.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

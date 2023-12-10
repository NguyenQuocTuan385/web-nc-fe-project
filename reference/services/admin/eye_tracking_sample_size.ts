import { API } from 'config/constans';
import { CreateEyeTrackingSampleSize, EyeTrackingSampleSize, GetListEyeTrackingSampleSize, UpdateEyeTrackingSampleSize } from 'models/Admin/eye_tracking_sample_size';
import api from 'services/configApi';

export class AdminEyeTrackingSampleSizeService {

  static async getList(data: GetListEyeTrackingSampleSize): Promise<any> {
    return await api.get(API.ADMIN.EYE_TRACKING_SAMPLE_SIZE.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getDetail(id: number, language?: string): Promise<EyeTrackingSampleSize> {
    return await api.get(`${API.ADMIN.EYE_TRACKING_SAMPLE_SIZE.DEFAULT}/${id}`, {
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

  static async create(data: CreateEyeTrackingSampleSize): Promise<any> {
    return await api.post(API.ADMIN.EYE_TRACKING_SAMPLE_SIZE.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateEyeTrackingSampleSize): Promise<any> {
    return await api.put(`${API.ADMIN.EYE_TRACKING_SAMPLE_SIZE.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.EYE_TRACKING_SAMPLE_SIZE.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

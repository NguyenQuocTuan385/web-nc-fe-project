import { API } from 'config/constans';
import { GetAll } from 'models/quota';
import api from 'services/configApi';

export class QuotaService {

  static async getQuotas(projectId: number): Promise<any> {
    return await api.get(API.QUOTA.DEFAULT, {
      params: {
        projectId
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getAll(data: GetAll): Promise<any> {
    return await api.get(API.QUOTA.ALL, {
      params: {
        data
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

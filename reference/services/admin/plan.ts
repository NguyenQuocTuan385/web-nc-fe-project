import { API } from 'config/constans';
import { CreateOrUpdatePlanInput, GetPlansParams } from 'models/Admin/plan';
import api from 'services/configApi';

export class AdminPlanService {

  static async getPlans(data: GetPlansParams): Promise<any> {
    return await api.get(API.ADMIN.PLAN.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getPlan(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.PLAN.DEFAULT}/${id}`, {
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

  static async create(data: CreateOrUpdatePlanInput): Promise<any> {
    return await api.post(API.ADMIN.PLAN.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: CreateOrUpdatePlanInput): Promise<any> {
    return await api.put(`${API.ADMIN.PLAN.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.PLAN.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateStatus(id: number, status: number): Promise<any> {
    return await api.put(`${API.ADMIN.PLAN.UPDATE_STATUS.replace(':id', `${id}`)}`, {
      status
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

export default AdminPlanService
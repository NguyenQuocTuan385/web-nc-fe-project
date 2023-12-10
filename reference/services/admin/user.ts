import { API } from 'config/constans';
import { GetUsersParams } from 'models/Admin/user';
import api from 'services/configApi';

export class AdminUserService {
  static async getUsers(data: GetUsersParams): Promise<any> {
    return await api.get(API.ADMIN.USER.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getUser(id: number): Promise<any> {
    return await api.get(`${API.ADMIN.USER.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async create(data: FormData): Promise<any> {
    return await api.post(API.ADMIN.USER.DEFAULT, data, {
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
    return await api.put(`${API.ADMIN.USER.DEFAULT}/${id}`, data, {
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
    return await api.delete(`${API.ADMIN.USER.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async restore(id: number): Promise<any> {
    return await api.put(`${API.ADMIN.USER.RESTORE}`.replace(':id', `${id}`))
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

export default AdminUserService
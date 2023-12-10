import { API } from 'config/constans';
import { CreateUserAttribute, GetUserAttributeParams, UpdateUserAttribute } from 'models/user_attribute';
import api from 'services/configApi';

export class UserAttributeService {

  static async getUserAttributes(data: GetUserAttributeParams): Promise<any> {
    return await api.get(API.USER_ATTRIBUTE.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async create(data: CreateUserAttribute): Promise<any> {
    return await api.post(API.USER_ATTRIBUTE.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateUserAttribute): Promise<any> {
    return await api.put(`${API.USER_ATTRIBUTE.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.USER_ATTRIBUTE.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

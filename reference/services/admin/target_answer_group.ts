import { API } from 'config/constans';
import { CreateAnswerGroupParams, GetAnswerGroupsParams, UpdateAnswerGroupParams } from 'models/Admin/target';
import api from 'services/configApi';

export class TargetAnswerGroupService {

  static async getAnswerGroups(data: GetAnswerGroupsParams): Promise<any> {
    return await api.get(API.ADMIN.TARGET.ANSWER_GROUP.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getAnswerGroup(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.TARGET.ANSWER_GROUP.DEFAULT}/${id}`, {
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

  static async create(data: CreateAnswerGroupParams): Promise<any> {
    return await api.post(API.ADMIN.TARGET.ANSWER_GROUP.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateAnswerGroupParams): Promise<any> {
    return await api.put(`${API.ADMIN.TARGET.ANSWER_GROUP.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.TARGET.ANSWER_GROUP.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }


}

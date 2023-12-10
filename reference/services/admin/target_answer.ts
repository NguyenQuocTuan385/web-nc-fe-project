import { API } from 'config/constans';
import { CreateAnswerParams, GetAnswersParams, UpdateAnswerParams } from 'models/Admin/target';
import api from 'services/configApi';

export class TargetAnswerService {

  static async getAnswers(data: GetAnswersParams): Promise<any> {
    return await api.get(API.ADMIN.TARGET.ANSWER.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getAnswer(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.TARGET.ANSWER.DEFAULT}/${id}`, {
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

  static async create(data: CreateAnswerParams): Promise<any> {
    return await api.post(API.ADMIN.TARGET.ANSWER.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateAnswerParams): Promise<any> {
    return await api.put(`${API.ADMIN.TARGET.ANSWER.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.TARGET.ANSWER.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }


}

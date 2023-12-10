import { API } from 'config/constans';
import { CreateQuestionParams, GetQuestionsParams, UpdateQuestionParams } from 'models/Admin/target';
import api from 'services/configApi';

export class TargetQuestionService {

  static async getQuestions(data: GetQuestionsParams): Promise<any> {
    return await api.get(API.ADMIN.TARGET.QUESTION.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getQuetion(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.TARGET.QUESTION.DEFAULT}/${id}`, {
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

  static async create(data: CreateQuestionParams): Promise<any> {
    return await api.post(API.ADMIN.TARGET.QUESTION.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateQuestionParams): Promise<any> {
    return await api.put(`${API.ADMIN.TARGET.QUESTION.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.TARGET.QUESTION.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }


}

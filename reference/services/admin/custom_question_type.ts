import { API } from 'config/constans';
import { AdminGetCustomQuestionTypes, AdminUpdateCustomQuestionType } from 'models/Admin/custom_question_type';
import api from 'services/configApi';

export class AdminCustomQuestionTypeService {

  static async getCustomQuestionTypes(data: AdminGetCustomQuestionTypes): Promise<any> {
    return await api.get(API.ADMIN.CUSTOM_QUESTION_TYPE.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getCustomQuestionType(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.CUSTOM_QUESTION_TYPE.DEFAULT}/${id}`, {
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

  static async update(id: number, data: AdminUpdateCustomQuestionType): Promise<any> {
    return await api.put(`${API.ADMIN.CUSTOM_QUESTION_TYPE.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

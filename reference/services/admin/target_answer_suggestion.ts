import { API } from 'config/constans';
import { GetAnswerSuggestionsParams, CreateAnswerSuggestionParams, UpdateAnswerSuggestionParams } from 'models/Admin/target';
import api from 'services/configApi';

export class TargetAnswerSuggestionService {

  static async getAnswerSuggestions(data: GetAnswerSuggestionsParams): Promise<any> {
    return await api.get(API.ADMIN.TARGET.ANSWER_SUGGESTION.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getAnswerSuggestion(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.TARGET.ANSWER_SUGGESTION.DEFAULT}/${id}`, {
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

  static async create(data: CreateAnswerSuggestionParams): Promise<any> {
    return await api.post(API.ADMIN.TARGET.ANSWER_SUGGESTION.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateAnswerSuggestionParams): Promise<any> {
    return await api.put(`${API.ADMIN.TARGET.ANSWER_SUGGESTION.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.TARGET.ANSWER_SUGGESTION.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }


}

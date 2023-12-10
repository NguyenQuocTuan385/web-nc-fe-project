import { API } from 'config/constans';
import { GetQuestions } from 'models/target';
import api from 'services/configApi';

export class TargetService {
  static async getQuestions(data: GetQuestions): Promise<any> {
    return await api.get(API.TARGET.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}
import { API } from 'config/constans';
import { GetCustomQuestionTypes } from 'models/Admin/custom_question_type';
import api from 'services/configApi';

export class CustomQuestionTypeService {

  static async getCustomQuestionTypes(data: GetCustomQuestionTypes): Promise<any> {
    return await api.get(API.CUSTOM_QUESTION_TYPE.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

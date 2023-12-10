import { API } from 'config/constans';
import { GetAdditionalAttributeParams } from 'models/additional_attribute';
import api from 'services/configApi';

export class AdditionalAttributeService {

  static async getAdditionalAttributes(data: GetAdditionalAttributeParams): Promise<any> {
    return await api.get(API.ATTRIBUTE.DEFAULT, {
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

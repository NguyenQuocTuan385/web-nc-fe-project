import api from './configApi';
import { API } from 'config/constans';
import { ConfigData } from 'models/config';

export class ConfigService {
  static async getConfigs(): Promise<ConfigData> {
    return await api.get(API.CONFIG.DEFAULT)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

export default ConfigService
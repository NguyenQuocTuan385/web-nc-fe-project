import { DataOption, PaginationParams } from './../models/general';
import api from './configApi';
import { API } from 'config/constans';

export class CountryService {
  static async getCountries(data?: PaginationParams): Promise<DataOption> {
    return await api.get(API.COUNTRY.LIST, {
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

export default CountryService
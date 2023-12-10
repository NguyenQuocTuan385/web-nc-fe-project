import { API } from 'config/constans';
import { CreateAdditionalBrand, GetAdditionalBrandList, UpdateAdditionalBrand } from 'models/additional_brand';
import api from 'services/configApi';

export class AdditionalBrandService {
  static async getAdditionalBrandList(data: GetAdditionalBrandList) {
    return await api.get(API.ADDITIONAL_BRAND.DEFAULT, {
      params: data
    })
    .then((res) => {
      return Promise.resolve(res.data)
    })
    .catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  }
  static async create(data: CreateAdditionalBrand): Promise<any> {
    return await api.post(`${API.ADDITIONAL_BRAND.DEFAULT}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async update(id: number, data: UpdateAdditionalBrand): Promise<any> {
    return await api.put(`${API.ADDITIONAL_BRAND.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADDITIONAL_BRAND.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

}

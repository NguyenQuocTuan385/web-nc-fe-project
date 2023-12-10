import { API } from 'config/constans';
import { CreateProjectBrand, GetProjectBrandParams } from 'models/project_brand';
import api from 'services/configApi';

export class ProjectBrandService {
  static async getProjectBrandList(data: GetProjectBrandParams) {
    return await api.get(API.PROJECT_BRAND.DEFAULT, {
      params: data
    })
    .then((res) => {
      return Promise.resolve(res.data)
    })
    .catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  }
  static async create(data: CreateProjectBrand): Promise<any> {
    return await api.post(`${API.PROJECT_BRAND.DEFAULT}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.PROJECT_BRAND.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

}

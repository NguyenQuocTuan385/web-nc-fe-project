import { API } from 'config/constans';
import { CreateProjectAttribute, GetProjectAttributeParams } from 'models/project_attribute';
import api from 'services/configApi';

export class ProjectAttributeService {

  static async getProjectAttributes(data: GetProjectAttributeParams): Promise<any> {
    return await api.get(API.PROJECT_ATTRIBUTE.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async create(data: CreateProjectAttribute): Promise<any> {
    return await api.post(API.PROJECT_ATTRIBUTE.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.PROJECT_ATTRIBUTE.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

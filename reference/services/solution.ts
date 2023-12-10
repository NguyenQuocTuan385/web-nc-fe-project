import { API } from 'config/constans';
import { UserGetSolutionCategories, UserGetSolutions } from 'models/solution';
import api from 'services/configApi';

export class SolutionService {
  static async getSolutionCategories(data: UserGetSolutionCategories): Promise<any> {
    return await api.get(API.SOLUTION.CATEGORY, { params: data })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getSolutionCategoriesHome(): Promise<any> {
    return await api.get(API.SOLUTION.CATEGORY_HOME)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getSolutions(data: UserGetSolutions): Promise<any> {
    return await api.get(API.SOLUTION.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getSolution(id: number): Promise<any> {
    return await api.get(`${API.SOLUTION.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}
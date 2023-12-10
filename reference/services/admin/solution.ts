import { API } from 'config/constans';
import { CreateSolutionCategoryParams, GetSolutionCategoriesHomeParams, GetSolutionCategoriesParams, GetSolutionsParams, UpdateSolutionCategoryParams } from 'models/Admin/solution';
import api from 'services/configApi';

export class AdminSolutionService {

  static async getSolutionCategories(data: GetSolutionCategoriesParams): Promise<any> {
    return await api.get(API.ADMIN.SOLUTION_CATEGORY.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getSolutionCategory(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.SOLUTION_CATEGORY.DEFAULT}/${id}`, {
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

  static async createSolutionCategory(data: CreateSolutionCategoryParams): Promise<any> {
    return await api.post(API.ADMIN.SOLUTION_CATEGORY.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateSolutionCategory(id: number, data: UpdateSolutionCategoryParams): Promise<any> {
    return await api.put(`${API.ADMIN.SOLUTION_CATEGORY.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async deleteSolutionCategory(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.SOLUTION_CATEGORY.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateSolutionCategoryStatus(id: number, status: number): Promise<any> {
    return await api.put(`${API.ADMIN.SOLUTION_CATEGORY.UPDATE_STATUS.replace(':id', `${id}`)}`, {
      status
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getSolutions(data: GetSolutionsParams): Promise<any> {
    return await api.get(API.ADMIN.SOLUTION.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getSolution(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.SOLUTION.DEFAULT}/${id}`, {
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

  static async createSolution(data: FormData): Promise<any> {
    return await api.post(API.ADMIN.SOLUTION.DEFAULT, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateSolution(id: number, data: FormData): Promise<any> {
    return await api.put(`${API.ADMIN.SOLUTION.DEFAULT}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async deleteSolution(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.SOLUTION.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateSolutionStatus(id: number, status: number): Promise<any> {
    return await api.put(`${API.ADMIN.SOLUTION.UPDATE_STATUS.replace(':id', `${id}`)}`, {
      status
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getSolutionCategoriesHome(data: GetSolutionCategoriesHomeParams): Promise<any> {
    return await api.get(API.ADMIN.SOLUTION_CATEGORY_HOME.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getSolutionCategoryHome(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.SOLUTION_CATEGORY_HOME.DEFAULT}/${id}`, {
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

  static async createSolutionCategoryHome(data: FormData): Promise<any> {
    return await api.post(API.ADMIN.SOLUTION_CATEGORY_HOME.DEFAULT, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateSolutionCategoryHome(id: number, data: FormData): Promise<any> {
    return await api.put(`${API.ADMIN.SOLUTION_CATEGORY_HOME.DEFAULT}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async deleteSolutionCategoryHome(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.SOLUTION_CATEGORY_HOME.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateSolutionCategoryHomeStatus(id: number, status: number): Promise<any> {
    return await api.put(`${API.ADMIN.SOLUTION_CATEGORY_HOME.UPDATE_STATUS.replace(':id', `${id}`)}`, {
      status
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

}

export default AdminSolutionService
import { API } from 'config/constans';
import { CreateAttribute, GetAttributesParams, UpdateAttribute, GetAttributeCategoriesParams, UpdateAttributeCategoryParams, CreateAttributeCategoryParams } from 'models/Admin/attribute';
import api from 'services/configApi';

export class AdminAttributeService {

  static async getAttributes(data: GetAttributesParams): Promise<any> {
    return await api.get(API.ADMIN.ATTRIBUTE.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getAttribute(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.ATTRIBUTE.DEFAULT}/${id}`, {
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

  static async create(data: CreateAttribute): Promise<any> {
    return await api.post(API.ADMIN.ATTRIBUTE.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateAttribute): Promise<any> {
    return await api.put(`${API.ADMIN.ATTRIBUTE.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.ATTRIBUTE.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getAttributeCategories(data: GetAttributeCategoriesParams): Promise<any> {
    return await api.get(API.ADMIN.ATTRIBUTE_CATEGORY.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async deleteAttributeCategories(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.ATTRIBUTE_CATEGORY.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateAttributeCategoryStatus(id: number, status: number): Promise<any> {
    return await api.put(`${API.ADMIN.ATTRIBUTE_CATEGORY.UPDATE_STATUS.replace(':id', `${id}`)}`, {
      status
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getAttributeCategory(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.ATTRIBUTE_CATEGORY.DEFAULT}/${id}`, {
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

  static async updateAttributeCategory(id: number, data: UpdateAttributeCategoryParams): Promise<any> {
    return await api.put(`${API.ADMIN.ATTRIBUTE_CATEGORY.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async createAttributeCategory(data: CreateAttributeCategoryParams): Promise<any> {
    return await api.post(API.ADMIN.ATTRIBUTE_CATEGORY.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateStatus(id: number, status: number): Promise<any> {
    return await api.put(`${API.ADMIN.ATTRIBUTE.STATUS_DETAIL.replace(':id', `${id}`)}`, {
      status: status
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

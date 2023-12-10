import { API } from 'config/constans';
import { GetFolders } from 'models/folder';
import api from 'services/configApi';

export class FolderService {
  static async getFolders(data: GetFolders) {
    return await api.get(API.FOLDER.DEFAULT, {
      params: data
    })
    .then((res) => {
      return Promise.resolve(res.data)
    })
    .catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  }
  static async create(data: { name: string }): Promise<any> {
    return await api.post(`${API.FOLDER.DEFAULT}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async update(id: number, data: { name: string }): Promise<any> {
    return await api.put(`${API.FOLDER.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.FOLDER.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

}

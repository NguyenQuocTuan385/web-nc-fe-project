import { API } from 'config/constans';
import { CreateBrandAsset, GetBrandAssetParams, UpdateBrandAsset } from 'models/brand_asset';
import api from 'services/configApi';

export class BrandAssetService {
  static async getBrandAssetList(data: GetBrandAssetParams) {
    return await api.get(API.BRAND_ASSET.DEFAULT, {
      params: data
    })
    .then((res) => {
      return Promise.resolve(res.data)
    })
    .catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  }
  static async create(data: FormData): Promise<any> {
    return await api.post(`${API.BRAND_ASSET.DEFAULT}`, data, {
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
  static async update(id: number, data: FormData): Promise<any> {
    return await api.put(`${API.BRAND_ASSET.DEFAULT}/${id}`, data, {
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
  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.BRAND_ASSET.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

}

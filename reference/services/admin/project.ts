import { API } from 'config/constans';
import { AdditionalBrand } from 'models/additional_brand';
import { AdminGetProjects } from 'models/Admin/project';
import { CustomQuestion } from 'models/custom_question';
import { Pack } from 'models/pack';
import { Project, ProjectTarget } from 'models/project';
import { ProjectAttribute } from 'models/project_attribute';
import { Quota } from 'models/quota';
import { UserAttribute } from 'models/user_attribute';
import { Video } from 'models/video';
import api from 'services/configApi';
import { ProjectBrand } from './../../models/project_brand';
import { PaymentSchedule } from './../../models/payment_schedule';
import { BrandAsset } from 'models/brand_asset';
import { PriceTest } from 'models/price_test';

export class AdminProjectService {
  static async getProjects(data: AdminGetProjects): Promise<any> {
    return await api.get(API.ADMIN.PROJECT.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getProject(id: number): Promise<Project> {
    return await api.get(`${API.ADMIN.PROJECT.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getQuotas(id: number): Promise<Quota[]> {
    return await api.get(`${API.ADMIN.PROJECT.QUOTA.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: FormData) {
    return await api.put(`${API.ADMIN.PROJECT.DEFAULT}/${id}`, data, {
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
    return await api.delete(`${API.ADMIN.PROJECT.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getPacks(id: number): Promise<Pack[]> {
    return await api.get(`${API.ADMIN.PROJECT.PACK.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getVideos(id: number): Promise<Video[]> {
    return await api.get(`${API.ADMIN.PROJECT.VIDEO.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getPriceTest(id: number): Promise<PriceTest> {
    return await api.get(`${API.ADMIN.PROJECT.PRICE_TEST.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data?.[0])
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async eyeTrackingPacks(id: number): Promise<Pack[]> {
    return await api.get(`${API.ADMIN.PROJECT.EYE_TRACKING_PACK.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async additionalBrands(id: number): Promise<AdditionalBrand[]> {
    return await api.get(`${API.ADMIN.PROJECT.ADDITIONAL_BRAND.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async projectAttributes(id: number): Promise<ProjectAttribute[]> {
    return await api.get(`${API.ADMIN.PROJECT.PROJECT_ATTRIBUTE.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async userAttributes(id: number): Promise<UserAttribute[]> {
    return await api.get(`${API.ADMIN.PROJECT.USER_ATTRIBUTE.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getCustomQuestions(id: number): Promise<CustomQuestion[]> {
    return await api.get(`${API.ADMIN.PROJECT.CUSTOM_QUESTION.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getTargets(id: number): Promise<ProjectTarget[]> {
    return await api.get(`${API.ADMIN.PROJECT.TARGET.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  
  static async getMainBrands(id: number): Promise<AdditionalBrand[]> {
    return await api.get(`${API.ADMIN.PROJECT.MAIN_BRANDS.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getCompetingBrands(id: number): Promise<AdditionalBrand[]> {
    return await api.get(`${API.ADMIN.PROJECT.COMPETING_BRANDS.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getCompetitiveBrands(id: number): Promise<ProjectBrand[]> {
    return await api.get(`${API.ADMIN.PROJECT.COMPETITIVE_BRANDS.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getBrandAsset(id: number): Promise<BrandAsset[]> {
    return await api.get(`${API.ADMIN.PROJECT.BRAND_ASSET.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getPaymentSchedule(id: number): Promise<PaymentSchedule[]> {
    return await api.get(`${API.ADMIN.PROJECT.PAYMENT_SCHEDULE.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

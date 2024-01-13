import { API } from "config/constant";
import {
  GetAdvertises,
  UpdateAdvertise,
  UpdateAdvertiseStatus,
  UpdateStatus
} from "models/advertise";

export class AdvertiseService {
  static async getAdvertisesByLocationId(id: number, data: GetAdvertises, api: any): Promise<any> {
    return await api
      .get(`${API.ADVERTISE.DEFAULT.replace(":id", `${id}`)}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateAdvertiseLicense(
    id: number,
    data: UpdateAdvertiseStatus,
    api: any
  ): Promise<any> {
    return await api
      .put(`${API.ADVERTISE.UPDATE_LICENSE.replace(":id", `${id}`)}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async updateAdvertisesId(id: number, data: UpdateAdvertiseStatus, api: any): Promise<any> {
    return await api
      .put(`${API.ADVERTISE.UPDATE_LICENSE.replace(":id", `${id}`)}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getAllUnLicensingAdvertisement(data: GetAdvertises, api: any): Promise<any> {
    return await api
      .get(`${API.ADVERTISE.GET_ALL_UNLICENSING}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getAdvertisesById(id: number, api: any): Promise<any> {
    return await api
      .get(`${API.ADVERTISE.GET_BY_ID.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateStatus(id: number, data: UpdateStatus, api: any): Promise<any> {
    return await api
      .put(`${API.ADVERTISE.UPDATE_STATUS.replace(":id", `${id}`)}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateAdvertise(id: number, data: UpdateAdvertise, api: any): Promise<any> {
    return await api
      .put(`${API.ADVERTISE.UPDATE.replace(":id", `${id}`)}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteAdvertiseEditById(id: number, api: any): Promise<any> {
    return await api
      .delete(`${API.ADVERTISE.DELETE_ADVERTISE_EDIT.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async createAdvertise(data: UpdateAdvertise, api: any): Promise<any> {
    return await api
      .post(`${API.ADVERTISE.CREATE}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        console.log(e);
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteAdvertiseById(id: number, api: any): Promise<any> {
    return await api
      .delete(`${API.ADVERTISE.DELETE.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        console.log(e);
        return Promise.reject(e?.response?.data);
      });
  }
}

export default AdvertiseService;

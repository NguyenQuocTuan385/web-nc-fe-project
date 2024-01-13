import { API } from "config/constant";
import { GetAdvertiseTypes } from "models/advertiseType";

export class AdvertiseTypeService {
  static async getAllAdvertiseType(data: GetAdvertiseTypes, api: any): Promise<any> {
    return await api
      .get(`${API.ADVERTISE_TYPE.DEFAULT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteAdvertiseTypeById(id: number, api: any): Promise<any> {
    return await api
      .delete(`${API.ADVERTISE_TYPE.DELETE.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateAdvertiseTypeById(id: number, data: any, api: any): Promise<any> {
    return await api
      .put(`${API.ADVERTISE_TYPE.UPDATE.replace(":id", `${id}`)}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        console.log(e);
        return Promise.reject(e?.response?.data);
      });
  }
  static async createAdvertiseType(data: any, api: any): Promise<any> {
    return await api
      .post(`${API.ADVERTISE_TYPE.CREATE}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        console.log(e);
        return Promise.reject(e?.response?.data);
      });
  }
}

export default AdvertiseTypeService;

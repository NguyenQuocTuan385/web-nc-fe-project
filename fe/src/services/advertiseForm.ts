import { API } from "config/constant";
import { GetAdvertiseForms } from "models/advertiseForm";

export class AdvertiseFormService {
  static async getAllAdvertiseForm(data: GetAdvertiseForms, api: any): Promise<any> {
    return await api
      .get(`${API.ADVERTISE_FORM.DEFAULT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteAdvertiseFormById(id: number, api: any): Promise<any> {
    return await api
      .delete(`${API.ADVERTISE_FORM.DELETE.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateAdvertiseFormById(id: number, data: any, api: any): Promise<any> {
    return await api
      .put(`${API.ADVERTISE_FORM.UPDATE.replace(":id", `${id}`)}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async createAdvertiseForm(data: any, api: any): Promise<any> {
    return await api
      .post(`${API.ADVERTISE_FORM.CREATE}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        console.log(e);
        return Promise.reject(e?.response?.data);
      });
  }
}

export default AdvertiseFormService;

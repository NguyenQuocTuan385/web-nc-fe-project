import { API } from "config/constant";
import api from "./configApi";
import { GetAdvertiseForms } from "models/advertiseForm";

export class AdvertiseFormService {
  static async getAllAdvertiseForm(data: GetAdvertiseForms): Promise<any> {
    return await api
      .get(`${API.ADVERTISE_FORM.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
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
}

export default AdvertiseFormService;

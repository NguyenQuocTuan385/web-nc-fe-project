import { API } from "config/constant";
import { AdvertiseEditRequest } from "models/advertise";

export class AdvertiseEditService {
  static async createAdvertiseEditRequest(
    advertiseId: number,
    advertiseEditRequest: AdvertiseEditRequest,
    api: any
  ): Promise<any> {
    return await api
      .post(`${API.ADVERTISE.EDIT}`.replace(":id", `${advertiseId}`), advertiseEditRequest)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async editAdvertiseRequest(
    advertiseId: number,
    advertiseEditRequest: AdvertiseEditRequest,
    api: any
  ): Promise<any> {
    return await api
      .put(`${API.ADVERTISE.EDIT}`.replace(":id", `${advertiseId}`), advertiseEditRequest)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default AdvertiseEditService;

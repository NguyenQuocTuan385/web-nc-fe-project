import { API } from "config/constant";
import api from "./configApi";
import { AdvertiseEditRequest } from "models/advertise";

export class AdvertiseEditService {
  static async createAdvertiseEditRequest(
    advertiseId: number,
    advertiseEditRequest: AdvertiseEditRequest
  ): Promise<any> {
    return await api
      .post(`${API.ADVERTISE.EDIT}`.replace(":id", `${advertiseId}`), advertiseEditRequest)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default AdvertiseEditService;

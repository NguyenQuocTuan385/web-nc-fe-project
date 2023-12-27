import { API } from "config/constant";
import api from "./configApi";
import { GetAdvertises, UpdateAdvertiseStatus } from "models/advertise";

export class AdvertiseService {
  static async getAdvertisesByLocationId(id: number, data: GetAdvertises): Promise<any> {
    return await api
      .get(`${API.ADVERTISE.DEFAULT.replace(":id", `${id}`)}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateAdvertisesId(id: number, data: UpdateAdvertiseStatus): Promise<any> {
    return await api
      .put(`${API.ADVERTISE.UPDATE_LICENSE.replace(":id", `${id}`)}`, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default AdvertiseService;

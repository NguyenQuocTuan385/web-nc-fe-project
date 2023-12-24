import { API } from "config/constant";
import api from "./configApi";
import { GetAdvertises } from "models/advertise";

export class AdvertiseService {
  static async getAdvertises(id: number, data: GetAdvertises): Promise<any> {
    return await api
      .get(`${API.ADVERTISE.DEFAULT.replace(":id", `${id}`)}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getAdvertiseById(id: number): Promise<any> {
    return await api
      .get(`${API.ADVERTISE.DETAILS.replace(":id", `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default AdvertiseService;

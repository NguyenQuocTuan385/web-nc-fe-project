import { API } from "config/constant";
import api from "./configApi";
import { GetAdvertises } from "models/advertise";

export class AdvertiseService {
  static async getAdvertises(data: GetAdvertises): Promise<any> {
    return await api
      .get(`${API.ADVERTISE.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default AdvertiseService;

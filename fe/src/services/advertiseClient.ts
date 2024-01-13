import { API } from "config/constant";
import api from "./configApi";
import { GetAdvertises } from "models/advertise";

export class AdvertiseClientService {
  static async getAdvertisesByLocationId(id: number, data: GetAdvertises): Promise<any> {
    return await api
      .get(`${API.ADVERTISE_CLIENT.DEFAULT.replace(":id", `${id}`)}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default AdvertiseClientService;

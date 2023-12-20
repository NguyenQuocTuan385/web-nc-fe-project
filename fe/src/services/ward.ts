import { API } from "config/constant";
import api from "./configApi";
import { GetProperties } from "models/property";

export class WardService {
  static async getAllWardBy(
    propertyParentId: number,
    data: GetProperties
  ): Promise<any> {
    return await api
      .get(`${API.WARD.DEFAULT}/${propertyParentId}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default WardService;

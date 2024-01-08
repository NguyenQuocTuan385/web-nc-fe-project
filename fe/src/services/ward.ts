import { API } from "config/constant";
import api from "./configApi";
import { GetProperties, PropertyRequest } from "models/property";

export class WardService {
  static async getAllWardBy(propertyParentId: number, data: GetProperties): Promise<any> {
    return await api
      .get(`${API.WARD.DEFAULT.replace(":propertyParentId", `${propertyParentId}`)}`, {
        params: data
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteWardBy(id: number): Promise<any> {
    return await api
      .delete(`${API.WARD.DELETE.replace(":id", `${id}`)}`)
      .then((res) => {})
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateWardBy(id: number, propertyRequest: PropertyRequest): Promise<any> {
    const updateData = {
      name: propertyRequest.name,
      code: propertyRequest.code
    };

    return await api
      .put(`${API.WARD.UPDATE.replace(":id", `${id}`)}`, updateData)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default WardService;

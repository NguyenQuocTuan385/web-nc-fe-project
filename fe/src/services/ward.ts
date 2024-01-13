import { API } from "config/constant";
import { GetProperties, PropertyRequest } from "models/property";

export class WardService {
  static async getAllWardBy(propertyParentId: number, data: GetProperties, api: any): Promise<any> {
    return await api
      .get(`${API.WARD.DEFAULT.replace(":propertyParentId", `${propertyParentId}`)}`, {
        params: data
      })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteWardBy(id: number, api: any): Promise<any> {
    return await api
      .delete(`${API.WARD.DELETE.replace(":id", `${id}`)}`)
      .then((res: any) => {})
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateWardBy(id: number, propertyRequest: PropertyRequest, api: any): Promise<any> {
    const updateData = {
      name: propertyRequest.name,
      code: propertyRequest.code
    };

    return await api
      .put(`${API.WARD.UPDATE.replace(":id", `${id}`)}`, updateData)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default WardService;

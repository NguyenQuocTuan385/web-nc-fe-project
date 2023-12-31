import { API } from "config/constant";
import api from "./configApi";
import { GetProperties, PropertyRequest } from "models/property";

export class DistrictService {
  static async getAllDistrict(data: GetProperties): Promise<any> {
    return await api
      .get(`${API.DISTRICT.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateDistrict(id: number, propertyRequest: PropertyRequest): Promise<any> {
    const updateData = {
      name: propertyRequest.name,
      code: propertyRequest.code
    };

    return await api
      .put(`${API.DISTRICT.UPDATE.replace(":id", `${id}`)}`, updateData)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async deleteDistrict(id: number): Promise<any> {
    return await api
      .delete(`${API.DISTRICT.DELETE.replace(":id", `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default DistrictService;

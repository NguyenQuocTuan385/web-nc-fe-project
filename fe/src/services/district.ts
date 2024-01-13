import { API } from "config/constant";
import { GetProperties, PropertyCreateRequest, PropertyRequest } from "models/property";

export class DistrictService {
  static async getAllDistrict(data: GetProperties, api: any): Promise<any> {
    return await api
      .get(`${API.DISTRICT.DEFAULT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateDistrict(
    id: number,
    propertyRequest: PropertyRequest,
    api: any
  ): Promise<any> {
    const updateData = {
      name: propertyRequest.name,
      code: propertyRequest.code
    };

    return await api
      .put(`${API.DISTRICT.UPDATE.replace(":id", `${id}`)}`, updateData)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async deleteDistrict(id: number, api: any): Promise<any> {
    return await api
      .delete(`${API.DISTRICT.DELETE.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getWardWithParentId(id: number, api: any): Promise<any> {
    return await api
      .get(`${API.DISTRICT.GET_BY_PARENT_ID.replace(":id", `${id}`)}`, {
        params: { pageSize: 999 }
      })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async createDistrict(propertyRequest: PropertyCreateRequest, api: any): Promise<any> {
    const createData = {
      propertyParentId: propertyRequest.propertyParentId,
      name: propertyRequest.name,
      code: propertyRequest.code
    };
    return await api
      .post(`${API.DISTRICT.DEFAULT}`, createData)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default DistrictService;

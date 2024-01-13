import { API } from "config/constant";
import { GetLocationTypes } from "models/location";

export class LocationTypeService {
  static async getAllLocationTypes(data: GetLocationTypes, api: any): Promise<any> {
    return await api
      .get(`${API.LOCATION_TYPE.DEFAULT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default LocationTypeService;

import { API } from "config/constant";
import api from "./configApi";
import { GetLocationTypes } from "models/location";

export class LocationTypeService {
  static async getAllLocationTypes(data: GetLocationTypes): Promise<any> {
    return await api
      .get(`${API.LOCATION_TYPE.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default LocationTypeService;

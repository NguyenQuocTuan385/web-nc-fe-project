import { API } from "config/constant";
import api from "./configApi";
import { GetLocations } from "models/location";

export class LocationService {
  static async getLocations(data: GetLocations): Promise<any> {
    return await api
      .get(`${API.LOCATION.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getLocationsById(id: number, data: GetLocations): Promise<any> {
    return await api
      .get(`${API.LOCATION.DETAILS.replace(":id", `${id}`)}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default LocationService;

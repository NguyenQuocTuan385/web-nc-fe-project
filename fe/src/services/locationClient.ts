import { API } from "config/constant";
import api from "./configApi";
import { GetLocations } from "models/location";

export class LocationClientService {
  static async getLocations(data: GetLocations): Promise<any> {
    return await api
      .get(`${API.LOCATION_CLIENT.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async checkExistsAdvertises(locationId: number): Promise<any> {
    return await api
      .get(`${API.LOCATION_CLIENT.EXISTS_ADVERTISES.replace(":id", `${locationId}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default LocationClientService;

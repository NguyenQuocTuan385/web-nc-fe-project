import { API } from "config/constant";
import api from "./configApi";
import { LocationEditRequest } from "models/location";

export class LocationEditService {
  static async createLocationEditRequest(locationId: number, locationEditRequest: LocationEditRequest): Promise<any> {
    return await api
      .post(`${API.LOCATION.EDIT}`.replace(":id", `${locationId}`), locationEditRequest)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default LocationEditService;

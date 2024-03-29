import { API } from "config/constant";
import { LocationEditRequest, LocationEditByCDMSRequest } from "models/location";

export class LocationEditService {
  static async createLocationEditRequest(
    locationId: number,
    locationEditRequest: LocationEditRequest,
    api: any
  ): Promise<any> {
    return await api
      .post(`${API.LOCATION.EDIT}`.replace(":id", `${locationId}`), locationEditRequest)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateLocationByCDMS(
    locationId: number,
    locationEditCDMSRequest: LocationEditByCDMSRequest,
    api: any
  ): Promise<any> {
    return await api
      .put(`${API.LOCATION.EDIT}`.replace(":id", `${locationId}`), locationEditCDMSRequest)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default LocationEditService;

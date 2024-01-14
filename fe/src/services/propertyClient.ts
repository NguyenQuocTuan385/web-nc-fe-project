import { API } from "config/constant";
import { GetProperties } from "models/property";
import api from "./configApi";
export class PropertyClientService {
  static async findPropertyByWardDistrictAddress(data: GetProperties): Promise<any> {
    return await api
      .get(`${API.PROPERTY_CLIENT.FIND_PROPERTY_BY_WARD_AND_DISTRICT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default PropertyClientService;

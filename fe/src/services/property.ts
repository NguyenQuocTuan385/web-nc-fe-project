import { API } from "config/constant";
import { GetProperties } from "models/property";
export class PropertyService {
  static async findPropertyByWardDistrictAddress(data: GetProperties, api: any): Promise<any> {
    return await api
      .get(`${API.PROPERTY.FIND_PROPERTY_BY_WARD_AND_DISTRICT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default PropertyService;

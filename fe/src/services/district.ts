import { API } from "config/constant";
import api from "./configApi";
import { GetProperties } from "models/property";

export class DistrictService {
  static async getAllDistrict(data: GetProperties): Promise<any> {
    return await api
      .get(`${API.DISTRICT.DEFAULT}`, { params: data })
      .then((res) => {
        //   console.log(res.data);
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default DistrictService;

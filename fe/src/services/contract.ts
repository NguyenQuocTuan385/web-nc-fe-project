import { API } from "config/constant";
import api from "./configApi";
import { GetContract } from "models/contract";

export class ContractService {
  static async getContracts(data: GetContract): Promise<any> {
    return await api
      .get(`${API.CONTRACT.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default ContractService;

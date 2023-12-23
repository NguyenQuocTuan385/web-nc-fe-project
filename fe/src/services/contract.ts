import { API } from "config/constant";
import api from "./configApi";
import { GetContract } from "models/contract";

export class ContractService {
  static async getContracts(data: GetContract, propertyId : Number): Promise<any> {
    return await api
      .get(`${API.CONTRACT.DEFAULT.replace(":id", `${propertyId}`)}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getContractsByAdvertise(id: number, data: GetContract): Promise<any> {
    return await api
      .get(`${API.CONTRACT.ByAdvertiseId.replace(":id", `${id}`)}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async deleteContracts(id: number): Promise<any> {
    return await api
      .delete(`${API.CONTRACT.DELETE.replace(":id", `${id}`)}}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default ContractService;

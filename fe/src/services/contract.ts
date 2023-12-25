import { API } from "config/constant";
import api from "./configApi";
import { GetContract, PutContract } from "models/contract";

export class ContractService {
  static async getContracts(data: GetContract, propertyId: Number): Promise<any> {
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

  static async getContractsByAdvertiseOne(id: number, data: GetContract): Promise<any> {
    return await api
      .get(`${API.CONTRACT.ByAdvertiseIdOne.replace(":id", `${id}`)}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async deleteContracts(id: number): Promise<any> {
    return await api
      .delete(`${API.CONTRACT.DELETE.replace(":id", `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getContractById(id: number): Promise<any> {
    return await api
      .get(`${API.CONTRACT.ById.replace(":id", `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async createContract(contractData: PutContract): Promise<any> {
    return await api
      .post(`${API.CONTRACT.CREATE}`, contractData)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default ContractService;

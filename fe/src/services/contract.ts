import { API } from "config/constant";
import api from "./configApi";
import { GetContract, PutContract, UpdateContractStatus } from "models/contract";

export class ContractService {
  static async getContracts(data: GetContract, propertyId: Number, api: any): Promise<any> {
    return await api
      .get(`${API.CONTRACT.DEFAULT.replace(":id", `${propertyId}`)}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getContractsByProperty(data: GetContract): Promise<any> {
    return await api
      .get(`${API.CONTRACT.GETBYPROPERTY_PARENT_ID}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getContractsByAdvertise(id: number, data: GetContract): Promise<any> {
    return await api
      .get(`${API.CONTRACT.BY_ADVERTISE_ID.replace(":id", `${id}`)}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async findContractLicensingByAdvertiseId(
    id: number,
    data: GetContract,
    api: any
  ): Promise<any> {
    return await api
      .get(`${API.CONTRACT.BY_ADVERTISE_ID_ONE.replace(":id", `${id}`)}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
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

  static async getContractById(id: number, api: any): Promise<any> {
    return await api
      .get(`${API.CONTRACT.ById.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async createContract(contractData: PutContract, api: any): Promise<any> {
    return await api
      .post(`${API.CONTRACT.CREATE}`, contractData)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getContractByPropertyAndParent(data: GetContract, api: any): Promise<any> {
    return await api
      .get(`${API.CONTRACT.CONTRACTBYPROPERTY}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async updateContractById(id: number, data: UpdateContractStatus): Promise<any> {
    return await api
      .put(`${API.CONTRACT.UPDATE_STATUS.replace(":id", `${id}`)}`, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default ContractService;

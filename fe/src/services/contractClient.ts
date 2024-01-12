import { API } from "config/constant";
import api from "./configApi";
import { GetContract } from "models/contract";

export class ContractClientService {
  static async findContractLicensingByAdvertiseId(id: number, data: GetContract): Promise<any> {
    return await api
      .get(`${API.CONTRACT_CLIENT.BY_ADVERTISE_ID_ONE.replace(":id", `${id}`)}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default ContractClientService;

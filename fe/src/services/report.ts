import { API } from "config/constant";
import api from "./configApi";
import { GetReports } from "models/report";

export class ReportService {
  static async getReports(data: GetReports): Promise<any> {
    return await api
      .get(`${API.REPORT.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default ReportService;

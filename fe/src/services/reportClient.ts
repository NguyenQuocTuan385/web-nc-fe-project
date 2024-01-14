import { API } from "config/constant";
import api from "./configApi";
import { GetReports, ReportCreateRequest } from "models/report";

export class ReportClientService {
  static async getReports(data: GetReports): Promise<any> {
    return await api
      .get(`${API.REPORT_CLIENT.DEFAULT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async createReport(createData: ReportCreateRequest): Promise<any> {
    return await api
      .post(`${API.REPORT_CLIENT.CREATE}`, createData)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getReportById(reportId: number): Promise<any> {
    return await api
      .get(`${API.REPORT_CLIENT.DETAILS.replace(":id", `${reportId}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default ReportClientService;

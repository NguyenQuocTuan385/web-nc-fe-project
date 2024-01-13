import { API } from "config/constant";
import { GetReports, ReportCreateRequest, ReportEditRequest } from "models/report";

export class ReportService {
  static async getReports(data: GetReports, api: any): Promise<any> {
    return await api
      .get(`${API.REPORT.DEFAULT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getReportsWithPropertyAndParent(data: GetReports, api: any): Promise<any> {
    return await api
      .get(`${API.REPORT.GET_WITH_PROPERTY_PARENT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getReportById(reportId: number, api: any): Promise<any> {
    return await api
      .get(`${API.REPORT.DETAILS.replace(":id", `${reportId}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async updateReport(
    reportId: number,
    updateData: ReportEditRequest,
    api: any
  ): Promise<any> {
    return await api
      .put(`${API.REPORT.UPDATE.replace(":id", `${reportId}`)}`, updateData)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async createReport(createData: ReportCreateRequest, api: any): Promise<any> {
    return await api
      .post(`${API.REPORT.CREATE}`, createData)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default ReportService;

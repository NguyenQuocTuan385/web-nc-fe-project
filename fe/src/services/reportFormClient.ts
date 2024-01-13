import { API } from "config/constant";
import api from "./configApi";
import { GetReportForms } from "models/reportForm";

export class ReportFormClientService {
  static async getAllReportForm(data: GetReportForms): Promise<any> {
    return await api
      .get(`${API.REPORT_FORM_CLIENT.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default ReportFormClientService;

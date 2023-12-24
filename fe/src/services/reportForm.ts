import { API } from "config/constant";
import api from "./configApi";
import { GetReportForms, ReportForm } from "models/reportForm";

export class ReportFormService {
  static async getAllReportForm(data: GetReportForms): Promise<any> {
    return await api
      .get(`${API.REPORT_FORM.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default ReportFormService;

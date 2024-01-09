import { Email } from "@mui/icons-material";
import { API } from "config/constant";
import api from "./configApi";
import { EmailRequest } from "models/email";

export class MailService {
  static async sendTextEmail(emailTextRequest: EmailRequest): Promise<any> {
    return await api
      .post(`${API.EMAIL.SEND_TEXT_EMAIL}`, emailTextRequest)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async sendHtmlEmail(emailHtmlRequest: EmailRequest): Promise<any> {
    return await api
      .post(`${API.EMAIL.SEND_HTML_EMAIL}`, emailHtmlRequest)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default MailService;

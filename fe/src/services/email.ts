import { API } from "config/constant";
import { EmailRequest, RequestOTP } from "models/email";
import api from "./configApi";

export class MailService {
  static async sendTextEmail(emailTextRequest: EmailRequest, api: any): Promise<any> {
    return await api
      .post(`${API.EMAIL.SEND_TEXT_EMAIL}`, emailTextRequest)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async sendHtmlEmail(emailHtmlRequest: EmailRequest, api: any): Promise<any> {
    return await api
      .post(`${API.EMAIL.SEND_HTML_EMAIL}`, emailHtmlRequest)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async sendOTPToEmail(email: RequestOTP): Promise<any> {
    return await api
      .post(`${API.EMAIL.SEND_OTP_TO_EMAIL}`, email)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default MailService;

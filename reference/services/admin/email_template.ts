import { API } from 'config/constans';
import { GetEmailTemplates, UpdateEmailTemplate } from 'models/Admin/email_template';
import api from 'services/configApi';

export class EmailTemplateService {

  static async getList(data: GetEmailTemplates): Promise<any> {
    return await api.get(API.ADMIN.EMAIL_TEMPLATE.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getDetail(id: number): Promise<any> {
    return await api.get(`${API.ADMIN.EMAIL_TEMPLATE.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateEmailTemplate): Promise<any> {
    return await api.put(`${API.ADMIN.EMAIL_TEMPLATE.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }


}

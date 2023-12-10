import { API } from "config/constans";
import { GetWebHooksParams, WebhookData } from "models/Admin/webhook";
import api from "services/configApi";

export class AdminWebHookService {
  static async getWebhooks(data: GetWebHooksParams): Promise<any> {
    return await api
      .get(API.ADMIN.WEBHOOK.DEFAULT, {
        params: data,
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getWebHook(id: number): Promise<any> {
    return await api
      .get(`${API.ADMIN.WEBHOOK.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async create(data: WebhookData): Promise<any> {
    return await api
      .post(API.ADMIN.WEBHOOK.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async update(id: number, data: WebhookData): Promise<any> {
    return await api
      .put(`${API.ADMIN.WEBHOOK.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async delete(id: number): Promise<any> {
    return await api
      .delete(`${API.ADMIN.WEBHOOK.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

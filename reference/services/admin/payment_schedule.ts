import { API } from 'config/constans';
import api from 'services/configApi';
import { UpdateBasicInfo, RestartPaymentSchedule, GetPaymentScheduleRestartPreview } from 'models/Admin/payment_schedule';

export class AdminPaymentScheduleService {
  static async updateBasicInfo(id: number, data: UpdateBasicInfo): Promise<any> {
    return await api.put(API.ADMIN.PAYMENT_SCHEDULE.UPDATE_BASIC_INFO.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updatePaidStatus(id: number): Promise<any> {
    return await api.put(API.ADMIN.PAYMENT_SCHEDULE.UPDATE_STATUS.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async uploadInvoice(id: number, data: FormData): Promise<any> {
    return await api.post(API.ADMIN.PAYMENT_SCHEDULE.UPLOAD_INVOICE.replace(":id", `${id}`), data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async sendInvoiceReadyEmail(id: number): Promise<any> {
    return await api.post(API.ADMIN.PAYMENT_SCHEDULE.INVOICE_READY.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async restartPaymentSchedule(data: RestartPaymentSchedule): Promise<any> {
    return await api.post(API.ADMIN.PAYMENT_SCHEDULE.RESTART, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getPaymentScheduleRestartPreview(data: GetPaymentScheduleRestartPreview): Promise<any> {
    return await api.get(API.ADMIN.PAYMENT_SCHEDULE.PREVIEW_RESTART, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

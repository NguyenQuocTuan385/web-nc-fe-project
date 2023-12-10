import { API } from "config/constans";
import {
  GetListPaymentScheduleHistory,
  GetPaymentSchedule,
  GetPaymentSchedulePreview,
  PaymentScheduleMakeAnOrder,
} from "models/payment_schedule";
import { Payment } from "models/payment";
import api from "services/configApi";

export class PaymentScheduleService {
  static async getPaymentSchedulePreview(
    data: GetPaymentSchedulePreview
  ): Promise<any> {
    return await api
      .get(API.PAYMENT_SCHEDULE.PREVIEW, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async paymentScheduleMakeAnOrder(
    data: PaymentScheduleMakeAnOrder
  ): Promise<any> {
    return await api
      .post(API.PAYMENT_SCHEDULE.MAKE_AN_ORDER, data)
      .then((res) => {
        return Promise.resolve(res.data.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getPaymentSchedule(
    data: GetPaymentSchedule
  ): Promise<any> {
    return await api
      .get(API.PAYMENT_SCHEDULE.PAYMENT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getListPaymentScheduleHistory(
    data: GetListPaymentScheduleHistory
  ): Promise<any> {
    return await api
      .get(API.PAYMENT_SCHEDULE.PAYMENT_SCHEDULE_HISTORY, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getLatestPaidPaymentSchedule( projectId: number): Promise<any> {
    return await api
    .get(API.PAYMENT_SCHEDULE.LATEST_PAID, { params: {projectId: projectId} })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((e) => {
      return Promise.reject(e?.response?.data);
    });
  }
  static async getDetailPaymentSchedule(id: number): Promise<any> {
    return await api
      .get(`${API.PAYMENT_SCHEDULE.DETAIL.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  
   static async cancelPaymentSchedule(paymentScheduleId: number): Promise<Payment> {
     return await api
       .post(API.PAYMENT_SCHEDULE.CANCEL_PAYMENT, {
         paymentScheduleId,
       })
       .then((res) => {
         return Promise.resolve(res.data.data);
       })
       .catch((e) => {
         return Promise.reject(e?.response?.data);
       });
  }
  
   static async confirmPaymentSchedule(paymentScheduleId: number, userConfirm : boolean): Promise<Payment> {
     return await api.post(API.PAYMENT_SCHEDULE.CONFIRM_PAYMENT, {
       paymentScheduleId,
       userConfirm
    })
       .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

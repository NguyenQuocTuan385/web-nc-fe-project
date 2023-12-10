import { API } from 'config/constans';
import { UpdatePayment, GetPaymentsParams } from 'models/Admin/payment';
import api from 'services/configApi';

export class AdminPaymentService {

  static async getPayments(data: GetPaymentsParams): Promise<any> {
    return await api.get(API.ADMIN.PAYMENT.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getPayment(id: number): Promise<any> {
    return await api.get(`${API.ADMIN.PAYMENT.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdatePayment): Promise<any> {
    return await api.put(`${API.ADMIN.PAYMENT.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

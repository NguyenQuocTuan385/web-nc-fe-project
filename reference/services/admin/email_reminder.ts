import { API } from 'config/constans';
import { GetEmailReminders, UpdateEmailReminder } from 'models/Admin/email_reminder';
import api from 'services/configApi';

export class EmailReminderService {
    static async getList(data: GetEmailReminders): Promise<any> {
        return await api.get(API.ADMIN.EMAIL_REMINDER.DEFAULT, {
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
        return await api.get(`${API.ADMIN.EMAIL_REMINDER.DEFAULT}/${id}`)
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async create(data: UpdateEmailReminder): Promise<any> {
        return await api.post(`${API.ADMIN.EMAIL_REMINDER.DEFAULT}`, data)
            .then((res) => {
                return Promise.resolve(res.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async update(id: number, data: UpdateEmailReminder): Promise<any> {
        return await api.put(`${API.ADMIN.EMAIL_REMINDER.DEFAULT}/${id}`, data)
            .then((res) => {
                return Promise.resolve(res.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async delete(id: number): Promise<any> {
        return await api.delete(`${API.ADMIN.EMAIL_REMINDER.DEFAULT}/${id}`)
            .then((res) => {
                return Promise.resolve(res.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }
}

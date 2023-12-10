import { API } from 'config/constans';
import api from 'services/configApi';
import { ProjectResult, GetResult } from "models/Admin/project_result";


export class AdminProjectResultService {

    static async getProjectResult(data: GetResult): Promise<ProjectResult[]> {
        return await api.get(API.ADMIN.PROJECT_RESULT.DEFAULT, { params: data })
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async createResult(data: FormData): Promise<ProjectResult[]> {
        return await api.post(API.ADMIN.PROJECT_RESULT.DEFAULT, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                return Promise.resolve(res.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async updateResult(id: number, data: FormData): Promise<ProjectResult[]> {
        return await api.put(`${API.ADMIN.PROJECT_RESULT.DETAIL.replace(':id', `${id}`)}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                return Promise.resolve(res.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async deleteResult(id: number): Promise<ProjectResult[]> {
        return await api.delete(`${API.ADMIN.PROJECT_RESULT.DETAIL.replace(':id', `${id}`)}`)
            .then((res) => {
                return Promise.resolve(res.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async updateStatusReady(id: number): Promise<ProjectResult[]> {
        return await api.put(`${API.ADMIN.PROJECT_RESULT.UPDATE_READY.replace(':id', `${id}`)}`)
            .then((res) => {
                return Promise.resolve(res.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }
}

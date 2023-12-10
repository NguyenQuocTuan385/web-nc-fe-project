import { API } from "config/constans";
import { GetProjectUser, SendEmailInvite, ResendInvitationEmail, UpdateRole, RemoveAccess } from "models/project_user";
import api from "services/configApi";

export class ProjectUserService {
    static async getProjectUser(data: GetProjectUser) {
        return await api.get(API.PROJECT_USER.DEFAULT, {
            params: data
        })
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async sendEmailInvitation(data: SendEmailInvite) {
        return await api.post(`${API.PROJECT_USER.DEFAULT}/send-invitation-email`, data)
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async resendEmailInvitation(data: ResendInvitationEmail) {
        return await api.post(`${API.PROJECT_USER.DEFAULT}/resend-invitation-email`, data)
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async updateRole(data: UpdateRole) {
        return await api.put(`${API.PROJECT_USER.DEFAULT}/update-role`, data)
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async removeAccess(projectId: number, data: RemoveAccess) {
        return await api.delete(`${API.PROJECT_USER.DETAIL}/remove-access`.replace(":id", `${projectId}`), {
            params: data
        })
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

}

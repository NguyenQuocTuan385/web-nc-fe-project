import { API } from 'config/constans';
import api from 'services/configApi';
import { ProjectUser, SendEmailInviteProject, UpdateProjectRole, ResendProjectInvitationEmail } from "models/Admin/project_user";


export class AdminProjectUserService {

    static async sendEmailInviteProject(data: SendEmailInviteProject): Promise<any> {
        return await api.post(API.ADMIN.PROJECT_USER.SEND_INVITE_EMAIL, data)
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async updateProjectRole(data: UpdateProjectRole): Promise<any> {
        return await api.put(API.ADMIN.PROJECT_USER.UPDATE_PROJECT_ROLE, data)
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async resendProjectInvitationEmail(data: ResendProjectInvitationEmail): Promise<any> {
        return await api.post(API.ADMIN.PROJECT_USER.RESEND_INVITATION, data)
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async removeAccess(id: number): Promise<any> {
        return await api.delete(`${API.ADMIN.PROJECT_USER.REMOVE_ACCESS.replace(":id", `${id}`)}`)
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }
}

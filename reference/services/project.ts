import { API } from 'config/constans';
import { CreateProjectData, GetMyProjects, MoveProject, RenameProject, ResetQuota, UpdateProjectBasicInformation, UpdateQuota, UpdateTarget, UpdateEnableCustomQuestion, UpdateEnableEyeTracking, CancelSubscriptionData, UpdateCanChangePermissionAndShare, ParamsCreateProject } from 'models/project';
import api from 'services/configApi';

export class ProjectService {
  static async getProject(id: number): Promise<any> {
    return await api.get(`${API.PROJECT.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async createProject(data: CreateProjectData): Promise<any> {
    return await api.post(API.PROJECT.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getMyProjects(data: GetMyProjects): Promise<any> {
    return await api.get(API.PROJECT.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async deleteProject(id: number): Promise<any> {
    return await api.delete(`${API.PROJECT.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async moveProject(id: number, data: MoveProject): Promise<any> {
    return await api.put(API.PROJECT.MOVE.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async renameProject(id: number, data: RenameProject): Promise<any> {
    return await api.put(API.PROJECT.RENAME.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateProjectBasicInformation(id: number, data: UpdateProjectBasicInformation): Promise<any> {
    return await api.put(API.PROJECT.BASIC_INFORMATION.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getTargets(id: number): Promise<any> {
    return await api.get(API.PROJECT.TARGET.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateTarget(id: number, data: UpdateTarget): Promise<any> {
    return await api.put(API.PROJECT.TARGET.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateSampleSize(id: number, sampleSize: number): Promise<any> {
    return await api.put(API.PROJECT.SAMPLE_SIZE.replace(":id", `${id}`), {
      sampleSize
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateEyeTrackingSampleSize(id: number, eyeTrackingSampleSize: number): Promise<any> {
    return await api.put(API.PROJECT.EYE_TRACKING_SAMPLE_SIZE.replace(":id", `${id}`), {
      eyeTrackingSampleSize
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getQuota(id: number): Promise<any> {
    return await api.get(API.PROJECT.QUOTA.DEFAULT.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateQuota(id: number, data: UpdateQuota): Promise<any> {
    return await api.put(API.PROJECT.QUOTA.DEFAULT.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async resetQuota(id: number, data?: ResetQuota): Promise<any> {
    return await api.delete(API.PROJECT.QUOTA.DEFAULT.replace(":id", `${id}`), {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateEnableCustomQuestion(id: number, data: UpdateEnableCustomQuestion): Promise<any> {
    return await api.put(API.PROJECT.UPDATE_ENABLE_CUSTOM_QUESTION.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateEnableEyeTracking(id: number, data: UpdateEnableEyeTracking): Promise<any> {
    return await api.put(API.PROJECT.UPDATE_ENABLE_EYE_TRACKING.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async sendEmailHowToSetupSurvey(id:number, name: string, email: string) {
    return await api.post(API.PROJECT.SEND_EMAIL_HOW_TO_SETUP_SURVEY.replace(":id", `${id}`), {
      name,
      email,
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateAgreeQuota(id: number, agreeQuota: boolean) {
    return await api.post(API.PROJECT.UPDATE_AGREE_QUOTA.replace(":id", `${id}`), { agreeQuota })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async cancelPaymentScheduleSubscription(data: CancelSubscriptionData): Promise<any> {
    return await api.post(API.PROJECT.CANCEL_PAYMENT_SCHEDULE_SUBSCRIPTION, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateProjectCanChangePermissionAndShare(projectId: number, data: UpdateCanChangePermissionAndShare): Promise<any> {
    return await api.put(API.PROJECT.CAN_CHANGE_PERMISSION_AND_SHARE.replace(':id', `${projectId}`), data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async checkParamsCreateProject(data: ParamsCreateProject): Promise<any> {
    return await api.get(API.PROJECT.CHECK_PARAMS_CREATE_PROJECT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}
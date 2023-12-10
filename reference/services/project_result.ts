import { API } from "config/constans";
import { GetProjectResult } from "models/project_result";
import api from "services/configApi";

export class ProjectResultService {
  static async getProjectResult(data: GetProjectResult) {
    return await api.get(API.PROJECT_RESULT.DEFAULT, {
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

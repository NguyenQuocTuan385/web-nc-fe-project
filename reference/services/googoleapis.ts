import api from "./configApi";
import { API } from "config/constans";

export default class GoogleApisService {
  static async getVideosYoutube(data: { urls: string[], part: string[] }) {
    return await api.get(API.GOOGLE_APIS.VIDEO_YOUTUBE.DEFAULT, {
      params: data
    })
    .then((res) => {
      return Promise.resolve(res.data)
    })
    .catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  }
}
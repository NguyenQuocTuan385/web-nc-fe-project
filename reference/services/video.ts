import { API } from 'config/constans';
import { DataPagination } from 'models/general';
import { CHECK_YOUTUBE_LINK, CREATE_VIDEO, GET_VIDEOS, UPDATE_VIDEO, Video } from 'models/video';
import api from 'services/configApi';

export class VideoService {
    static async getVideos(data: GET_VIDEOS) {
        return await api.get<DataPagination<Video>>(API.VIDEO.DEFAULT, {
            params: data
        })
            .then((res) => {
                return Promise.resolve(res.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }
    static async create(data: CREATE_VIDEO): Promise<any> {
        return await api.post(API.VIDEO.DEFAULT, data)
            .then((res) => {
                return Promise.resolve(res.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async update(id: number, data: UPDATE_VIDEO): Promise<any> {
        return await api.put(`${API.VIDEO.DEFAULT}/${id}`, data)
            .then((res) => {
                return Promise.resolve(res.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async delete(id: number): Promise<any> {
        return await api.delete(`${API.VIDEO.DEFAULT}/${id}`)
            .then((res) => {
                return Promise.resolve(res.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async checkYoutubeLink(data: CHECK_YOUTUBE_LINK): Promise<boolean> {
        return await api.get(API.VIDEO.CHECK_YOUTUBE_LINK, {
            params: data
        })
            .then((res) => {
                return Promise.resolve(res.data.data)
            })
            .catch((e) => {
                return Promise.reject(e?.response?.data);
            })
    }

    static async getVideoDuration(file: File): Promise<number> {
        return new Promise((resolve, reject) => {
            window.URL = window.URL || window.webkitURL;
            const video = document.createElement('video')
            video.preload = 'metadata'
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src)
                resolve(video.duration)
                video.remove()
            }
            video.src = window.URL.createObjectURL(file)
            video.onerror = function () {
                reject("Invalid video. Please select a video file.")
            }
    
        })
    }
}
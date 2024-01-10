import { API } from "config/constant";
import api from "./configApi";
import {
  GetLocations,
  LocationCreateRequest,
  GetLocationsWithPropertyArray,
  putLocation,
  updateStatus
} from "models/location";

export class LocationService {
  static async getLocations(data: GetLocations): Promise<any> {
    return await api
      .get(`${API.LOCATION.DEFAULT}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getLocationsById(id: number, api: any): Promise<any> {
    return await api
      .get(`${API.LOCATION.GET_BY_ID.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateLocationsById(id: number, data: putLocation): Promise<any> {
    return await api
      .put(`${API.LOCATION.UPDATE.replace(":id", `${id}`)}`, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateStatus(id: number, data: updateStatus): Promise<any> {
    return await api
      .put(`${API.LOCATION.UPDATE_STATUS.replace(":id", `${id}`)}`, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteLocationEditById(id: number): Promise<any> {
    return await api
      .delete(`${API.LOCATION.DELETE.replace(":id", `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getLocationsReview(data: GetLocations): Promise<any> {
    return await api
      .get(`${API.LOCATION.GET_ALL_REVIEW}`, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async createLocation(locationCreateRequest: LocationCreateRequest): Promise<any> {
    return await api
      .post(`${API.LOCATION.DEFAULT}`, locationCreateRequest)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async checkExistsAdvertises(locationId: number): Promise<any> {
    return await api
      .get(`${API.LOCATION.EXISTS_ADVERTISES.replace(":id", `${locationId}`)}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getLocationsWithPropertyAndParent(
    data: GetLocationsWithPropertyArray,
    api: any
  ): Promise<any> {
    return await api
      .get(`${API.LOCATION.GET_WITH_PROPERTY_PARENT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default LocationService;

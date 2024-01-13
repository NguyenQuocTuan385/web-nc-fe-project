import { API } from "config/constant";
import {
  GetLocations,
  LocationCreateRequest,
  GetLocationsWithPropertyArray,
  putLocation,
  updateStatus
} from "models/location";

export class LocationService {
  static async getLocations(data: GetLocations, apii: any): Promise<any> {
    return await apii
      .get(`${API.LOCATION.DEFAULT}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
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
  static async updateLocationsById(id: number, data: putLocation, api: any): Promise<any> {
    return await api
      .put(`${API.LOCATION.UPDATE.replace(":id", `${id}`)}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async updateStatus(id: number, data: updateStatus, api: any): Promise<any> {
    return await api
      .put(`${API.LOCATION.UPDATE_STATUS.replace(":id", `${id}`)}`, data)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async deleteLocationEditById(id: number, api: any): Promise<any> {
    return await api
      .delete(`${API.LOCATION.DELETE.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async getLocationsReview(data: GetLocations, api: any): Promise<any> {
    return await api
      .get(`${API.LOCATION.GET_ALL_REVIEW}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async createLocation(
    locationCreateRequest: LocationCreateRequest,
    api: any
  ): Promise<any> {
    return await api
      .post(`${API.LOCATION.DEFAULT}`, locationCreateRequest)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async checkExistsAdvertises(locationId: number, api: any): Promise<any> {
    return await api
      .get(`${API.LOCATION.EXISTS_ADVERTISES.replace(":id", `${locationId}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getLocationsByPropertyId(id: number, data: GetLocations, api: any): Promise<any> {
    return await api
      .get(`${API.LOCATION.GET_BY_PROPERTY_ID.replace(":id", `${id}`)}`, { params: data })
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
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
  static async deleteLocationById(id: number, api: any): Promise<any> {
    return await api
      .delete(`${API.LOCATION.DELETE_LOCATION.replace(":id", `${id}`)}`)
      .then((res: any) => {
        return Promise.resolve(res.data);
      })
      .catch((e: any) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default LocationService;

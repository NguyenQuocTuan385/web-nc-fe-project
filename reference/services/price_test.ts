import { API } from 'config/constans';
import { EPRICE_TEST_TYPE_ID } from 'models';
import { UpdatePriceTest } from 'models/price_test';
import api from 'services/configApi';

export class PriceTestService {
  static async getPriceTest(data: {projectId: number}) {
    return await api.get(API.PRICE_TEST.DEFAULT, {
      params: data
    })
    .then((res) => {
      return Promise.resolve(res.data)
    })
    .catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  }

  static async update(id: number, data: UpdatePriceTest): Promise<any> {
    return await api.put(`${API.PRICE_TEST.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.PRICE_TEST.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async changeType(id:number, data: {typeId: EPRICE_TEST_TYPE_ID}): Promise<any> {
    return await api.put(API.PRICE_TEST.CHANGE_TYPE.replace(":id", `${id}`), data)
    .then((res) => {
      return Promise.resolve(res.data)
    })
    .catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  }

  static async createPicture(data: FormData, priceTestId: number): Promise<any> {
    return await api
    .post(API.PRICE_TEST.PICTURE.replace(":id", `${priceTestId}`), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then((res) => {
      return Promise.resolve(res.data)
    })
    .catch((e) => {
      return Promise.reject(e?.response?.data);
    })
  }
  static async deletePicture(priceTestId: number, pictureId: number): Promise<any> {
    return await api
      .delete(`${API.PRICE_TEST.PICTURE.replace(":id", `${priceTestId}`)}/${pictureId}`)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

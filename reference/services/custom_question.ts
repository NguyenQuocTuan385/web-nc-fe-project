import { API } from "config/constans";
import {
  CreateCustomQuestionInput,
  GetAllQuestionParams,
  GetTypeParams,
  UpdateOrderQuestionParams,
  UpdateCustomQuestionInput
} from "models/custom_question";
import api from "services/configApi";

export class CustomQuestionService {
  static async findAll(data: GetAllQuestionParams): Promise<any> {
    return await api
      .get(API.CUSTOM_QUESTION.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async findOne(id: number): Promise<any> {
    return await api
      .get(API.CUSTOM_QUESTION.QUESTION.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async create(data: CreateCustomQuestionInput): Promise<any> {
    return await api
      .post(API.CUSTOM_QUESTION.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async updateOrder(data: UpdateOrderQuestionParams): Promise<any> {
    return await api
      .put(API.CUSTOM_QUESTION.UPDATE_ORDER, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async update(id: number, data: UpdateCustomQuestionInput): Promise<any> {
    return await api
      .put(API.CUSTOM_QUESTION.QUESTION.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async delete(id: number): Promise<any> {
    return await api
      .delete(API.CUSTOM_QUESTION.QUESTION.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getTypes(data: GetTypeParams): Promise<any> {
    return await api
      .get(API.CUSTOM_QUESTION.GET_TYPES, {
        params: data,
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

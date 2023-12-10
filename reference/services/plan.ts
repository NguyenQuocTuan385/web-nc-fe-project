import { API } from 'config/constans';
import { UserGetPlans } from 'models/plan';
import api from 'services/configApi';
import { Plan } from "models/Admin/plan";
export class PlanService {
    static async getPlans(data: UserGetPlans): Promise<any> {
        return await api.get(API.PLAN.DEFAULT, {
            params: data
        })
        .then((res) => {
        return Promise.resolve(res.data)
        })
        .catch((e) => {
        return Promise.reject(e?.response?.data);
        })
    }
    static async getPlan(id: number): Promise<Plan> {
        return await api.get(`${API.PLAN.DEFAULT}/${id}`)
        .then((res) => {
            return Promise.resolve(res.data.data)
        })
        .catch((e) => {
            return Promise.reject(e?.response?.data);
        })
    }
}
import api from './configApi';
import { API } from 'config/constans';
import { CheckIsValidCode, ForgotPasswordData, LoginForm, RegisterData, SocialLoginData, ChangePassword, UpdatePaymentInfo, User, CreateGuest } from 'models/user';
export class UserService {
  static async login(data: LoginForm): Promise<any> {
    return await api.post(API.AUTH.LOGIN, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getMe(): Promise<User> {
    return await api.get(API.AUTH.ME)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  
  static async update(data: FormData): Promise<any> {
    return await api.put(`${API.USER.UPDATE_PROFILE}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async changePassword(data: ChangePassword): Promise<any> {
    return await api.put(`${API.USER.CHANGE_PASSWORD}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async sendVerifyEmail(email: string) {
    return await api.post(API.AUTH.SEND_VERIFY_EMAIL, { email })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async socialLogin(data: SocialLoginData) {
    return await api.post(API.AUTH.LOGIN_SOCIAL, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async register(data: RegisterData) {
    return await api.post(API.AUTH.REGISTER, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async active(code: string) {
    return await api.post(API.AUTH.ACTIVE, {
      code
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async sendEmailForgotPassword(email: string) {
    return await api.post(API.AUTH.SEND_EMAIL_FORGOT_PASSWORD, {
      email
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async forgotPassword(data: ForgotPasswordData) {
    return await api.post(API.AUTH.FORGOT_PASSWORD, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getPaymentInfo() {
    return await api.get(API.USER.PAYMENT_INFO)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async checkIsValidCode(data: CheckIsValidCode) {
    return await api.post(API.AUTH.CHECK_ISVALID_CODE, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updatePaymentInfo(data: UpdatePaymentInfo): Promise<any> {
    return await api.put(`${API.USER.UPDATE_PAYMENT_INFO}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async checkEmptyPassword() {
    return await api.get(API.AUTH.CHECK_EMPTY_PASSWORD)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async checkEmail(email:string) {
    return await api.post(API.AUTH.CHECK_EMAIL,{email:email})
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateAvatar(data: FormData): Promise<any> {
    return await api.put(`${API.USER.UPDATE_AVATAR}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  
  static async changeLanguage(language: string): Promise<any> {
    return await api.put(API.AUTH.CHANGE_LANGUAGE, {
      language
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async changeCurrency(currency: string) {
    return await api.put(API.AUTH.CHANGE_CURRENCY, {
      currency
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async getInfoUserGuest(
    data: CreateGuest
  ): Promise<any> {
    return await api
      .post(API.USER.INFO_USER_GUEST, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}

export default UserService
import { ConfigData } from "models/config";
import { SocialProvider } from "models/general";
import { User } from "models/user";

export const USER_SOCIAL_LOGIN_REQUEST = 'USER_SOCIAL_LOGIN_REQUEST';

export const USER_LOGIN_REDUCER = 'USER_LOGIN_REDUCER';

export const USER_LOGOUT_REQUEST = 'USER_LOGOUT_REQUEST';
export const USER_LOGOUT_REDUCER = 'USER_LOGOUT_REDUCER';

export const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST';

export const GET_ME_REQUEST = 'GET_ME_REQUEST';

export const ACTIVE_USER_REQUEST = 'ACTIVE_USER_REQUEST';

export const SEND_EMAIL_VERIFY_REQUEST = 'SEND_EMAIL_VERIFY_REQUEST';

export const SEND_EMAIL_FORGOT_PASSWORD_REQUEST = 'SEND_EMAIL_FORGOT_PASSWORD_REQUEST';

export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';

export const SET_PROJECT_STATE_REDUCER = 'SET_PROJECT_STATE_REDUCER';

export const SET_CONFIGS_REDUCER = 'SET_CONFIGS_REDUCER';

export const SET_VERIFIED_SUCCESS_REDUCER = 'SET_VERIFIED_SUCCESS_REDUCER';

export const SET_USER_USING_GUEST_REDUCER = 'SET_USER_USING_GUEST_REDUCER';

export const getMe = () => {
  return {
    type: GET_ME_REQUEST
  }
}

export const setUserLogin = (data: User) => {
  return {
    type: USER_LOGIN_REDUCER,
    data: data
  }
}

export const setUserUsingGuest = (data: boolean) => {
  return {
    type: SET_USER_USING_GUEST_REDUCER,
    data: data
  }
}

interface UserSocialLogin {
  token: string,
  provider: SocialProvider,
  guestId?: number
}

export const userSocialLogin = (data: UserSocialLogin) => {
  return {
    type: USER_SOCIAL_LOGIN_REQUEST,
    data: data
  }
}

export const userLogoutRequest = () => {
  return {
    type: USER_LOGOUT_REQUEST
  }
}

export const userLogoutReducer = () => {
  return {
    type: USER_LOGOUT_REDUCER
  }
}

export const setConfigs = (data: ConfigData) => {
  return {
    type: SET_CONFIGS_REDUCER,
    data
  }
}

export const setVerifiedSuccess = (data: boolean) => {
  return {
    type: SET_VERIFIED_SUCCESS_REDUCER,
    data
  }
}
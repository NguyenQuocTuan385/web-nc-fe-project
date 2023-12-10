import produce from 'immer';
import { ConfigData } from 'models/config';
import { User } from 'models/user';
import * as types from './actionTypes';

export interface UserState {
  user?: User,
  configs?: ConfigData,
  verifiedSuccess?: boolean,
  isUsingGuest?: boolean,
}

const initial: UserState = {
  user: null,
  configs: null,
  verifiedSuccess: false
}

export const userReducer = (state = initial, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case types.USER_LOGIN_REDUCER:
        draft.user = action.data;
        break;
      case types.USER_LOGOUT_REDUCER:
        draft.user = null;
        break;
      case types.SET_CONFIGS_REDUCER:
        draft.configs = action.data;
        break;
      case types.SET_VERIFIED_SUCCESS_REDUCER:
        draft.verifiedSuccess = action.data;
        break;
      case types.SET_USER_USING_GUEST_REDUCER:
        draft.isUsingGuest = action.data;
        break;
      default:
        return state;
    }
  })

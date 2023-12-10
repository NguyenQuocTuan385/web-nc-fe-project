import { put, takeLatest, call } from 'redux-saga/effects';
import { setLoadingAuth } from 'redux/reducers/Status/actionTypes';
import { GET_ME_REQUEST, setConfigs, setUserLogin, userLogoutRequest } from 'redux/reducers/User/actionTypes';
import { EKey } from 'models/general';
import UserService from 'services/user';
import ConfigService from 'services/config';

function* requestGetMe() {
  
  try {
    const configs = yield call(ConfigService.getConfigs);
    yield put(setConfigs(configs))
    const token = localStorage.getItem(EKey.TOKEN) ?? localStorage.getItem(EKey.TOKEN_GUEST);
    if(!token) {
      yield put(setLoadingAuth(false));
      return;
    }
    const userLogin = yield call(UserService.getMe);
    yield put(setUserLogin(userLogin))
  } catch (e: any) {
    if(e.status !== 401) {
      yield put(userLogoutRequest())
    }
  } finally {
    yield put(setLoadingAuth(false));
  }
}

function* getMe() {
  yield takeLatest(GET_ME_REQUEST, requestGetMe);
}

export default getMe;

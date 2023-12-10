import { call, put, takeLatest, select } from 'redux-saga/effects';
import { USER_SOCIAL_LOGIN_REQUEST, setUserLogin } from 'redux/reducers/User/actionTypes';
import { setLoading, setErrorMess } from 'redux/reducers/Status/actionTypes';
import UserService from 'services/user';
import { push } from 'connected-react-router';
import { routes } from 'routers/routes';
import shareLocalStorage from 'utils/shareLocalStorage';
import { EKey } from 'models/general';
import { ReducerType } from 'redux/reducers';

function* request(data: any) {
  try {
    yield put(setLoading(true));
    const userLogin = yield call(UserService.socialLogin, data.data);
    localStorage.setItem(EKey.TOKEN, userLogin.token)
    localStorage.removeItem(EKey.TOKEN_GUEST);
    yield put(setUserLogin(userLogin.user))
    shareLocalStorage()
    const { createProjectRedirect } = yield select((state: ReducerType) => state.project)
    if (createProjectRedirect) {
      yield put(push(routes.project.create));
    }
  } catch (e) {
    yield put(setErrorMess(e));
  } finally {
    yield put(setLoading(false));
  }
}

function* socialLogin() {
  yield takeLatest(USER_SOCIAL_LOGIN_REQUEST, request);
}

export default socialLogin;

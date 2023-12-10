
import { EKey } from 'models/general';
import { put, takeLatest } from 'redux-saga/effects';
import { userLogoutReducer, USER_LOGOUT_REQUEST } from 'redux/reducers/User/actionTypes';
import shareLocalStorage from 'utils/shareLocalStorage';

function* requestLogout() {
  yield put(userLogoutReducer())
  localStorage.removeItem(EKey.TOKEN)
  shareLocalStorage()
}

function* logout() {
  yield takeLatest(USER_LOGOUT_REQUEST, requestLogout);
}

export default logout;

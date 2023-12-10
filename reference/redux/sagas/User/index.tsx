import { all } from 'redux-saga/effects';
import getMe from './getMe';
import logout from './logout';
import socialLogin from './socialLogin';

export const userSagas = function* root() {
  yield all([
    logout(),
    getMe(),
    socialLogin(),
  ]);
};
import { all } from 'redux-saga/effects';
import { projectSagas } from './Project';
import { userSagas } from './User';

// Register all your watchers
export const rootSaga = function* root() {
  yield all([
    userSagas(),
    projectSagas()
  ]);
};

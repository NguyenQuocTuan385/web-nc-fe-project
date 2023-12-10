import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_PROJECT_ROLES, setProjectRolesReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { ProjectUserService } from 'services/project_user';

function* requestProjectRoles(data: { type: string,  projectId: number}) {
  try {
    const res = yield call(ProjectUserService.getProjectUser, { projectId: data.projectId});
    yield put(setProjectRolesReducer(res))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getProjectRoles() {
  yield takeLatest(GET_PROJECT_ROLES, requestProjectRoles);
}

export default getProjectRoles;

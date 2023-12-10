import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_TARGET_OF_PROJECT_REQUEST, setTargetReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { ProjectService } from 'services/project';

function* requestTarget(data: { type: string,  projectId: number}) {
  try {
    const res = yield call(ProjectService.getTargets, data.projectId);
    yield put(setTargetReducer(res.data))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getTarget() {
  yield takeLatest(GET_TARGET_OF_PROJECT_REQUEST, requestTarget);
}

export default getTarget;

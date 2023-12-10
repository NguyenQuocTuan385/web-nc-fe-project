import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_PROJECT_ATTRIBUTES_OF_PROJECT_REQUEST, setProjectAttributesReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { ProjectAttributeService } from 'services/project_attribute';

function* requestProjectAttributes(data: { type: string,  projectId: number}) {
  try {
    const res = yield call(ProjectAttributeService.getProjectAttributes, { projectId: data.projectId, take: 9999 });
    yield put(setProjectAttributesReducer(res.data))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getProjectAttributes() {
  yield takeLatest(GET_PROJECT_ATTRIBUTES_OF_PROJECT_REQUEST, requestProjectAttributes);
}

export default getProjectAttributes;

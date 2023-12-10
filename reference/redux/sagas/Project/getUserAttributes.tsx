import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_USER_ATTRIBUTES_OF_PROJECT_REQUEST, setUserAttributesReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { UserAttributeService } from 'services/user_attribute';

function* requestUserAttributes(data: { type: string,  projectId: number}) {
  try {
    const res = yield call(UserAttributeService.getUserAttributes, { projectId: data.projectId, take: 9999 });
    yield put(setUserAttributesReducer(res.data))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getUserAttributes() {
  yield takeLatest(GET_USER_ATTRIBUTES_OF_PROJECT_REQUEST, requestUserAttributes);
}

export default getUserAttributes;

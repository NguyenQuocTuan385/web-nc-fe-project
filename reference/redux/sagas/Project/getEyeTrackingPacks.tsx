import { PackPosition } from 'models/pack';
import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_EYE_TRACKING_PACKS_OF_PROJECT_REQUEST, setEyeTrackingPacksReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { PackService } from 'services/pack';

function* requestEyeTrackingPacks(data: { type: string,  projectId: number}) {
  try {
    const res = yield call(PackService.getPacks, { projectId: data.projectId, take: 9999, positionId: PackPosition.Eye_Tracking });
    yield put(setEyeTrackingPacksReducer(res.data))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getEyeTrackingPacks() {
  yield takeLatest(GET_EYE_TRACKING_PACKS_OF_PROJECT_REQUEST, requestEyeTrackingPacks);
}

export default getEyeTrackingPacks;
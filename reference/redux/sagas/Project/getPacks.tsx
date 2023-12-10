import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_PACKS_OF_PROJECT_REQUEST, setPacksReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { PackService } from 'services/pack';

function* requestGetPacks(data: { type: string,  projectId: number}) {
  try {
    const packData = yield call(PackService.getPacks, { projectId: data.projectId, take: 9999 });
    yield put(setPacksReducer(packData.data))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getPacks() {
  yield takeLatest(GET_PACKS_OF_PROJECT_REQUEST, requestGetPacks);
}

export default getPacks;

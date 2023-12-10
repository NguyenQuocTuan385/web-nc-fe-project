import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_PRICE_TEST_REQUEST, setPriceTestReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { PriceTestService } from 'services/price_test';

function* requestPriceTest(data: { type: string,  projectId: number}) {
  try {
    const res = yield call(PriceTestService.getPriceTest, { projectId: data.projectId});
    yield put(setPriceTestReducer(res.data?.[0]))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getPriceTest() {
  yield takeLatest(GET_PRICE_TEST_REQUEST, requestPriceTest);
}

export default getPriceTest;

import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_ADDITIONAL_BRANDS_OF_PROJECT_REQUEST, setAdditionalBrandsReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { AdditionalBrandService } from 'services/additional_brand';

function* requestAdditionalBrands(data: { type: string,  projectId: number}) {
  try {
    const res = yield call(AdditionalBrandService.getAdditionalBrandList, { projectId: data.projectId, take: 9999 });
    yield put(setAdditionalBrandsReducer(res.data))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getAdditionalBrands() {
  yield takeLatest(GET_ADDITIONAL_BRANDS_OF_PROJECT_REQUEST, requestAdditionalBrands);
}

export default getAdditionalBrands;

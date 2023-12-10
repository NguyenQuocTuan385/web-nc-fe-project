import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_BRAND_ASSETS_REQUEST, setBrandAssetsReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { BrandAssetService } from 'services/brand_asset';

function* requestBrandAssets(data: { type: string,  projectId: number}) {
  try {
    const res = yield call(BrandAssetService.getBrandAssetList, { projectId: data.projectId, take: 9999 });
    yield put(setBrandAssetsReducer(res.data))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getBrandAssets() {
  yield takeLatest(GET_BRAND_ASSETS_REQUEST, requestBrandAssets);
}

export default getBrandAssets;

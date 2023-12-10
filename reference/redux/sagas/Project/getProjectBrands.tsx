import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_PROJECT_BRANDS_REQUEST, setProjectBrandsReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { ProjectBrandService } from 'services/project_brand';

function* requestProjectAttributes(data: { type: string,  projectId: number}) {
  try {
    const res = yield call(ProjectBrandService.getProjectBrandList, { projectId: data.projectId, take: 9999 });
    yield put(setProjectBrandsReducer(res.data))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getProjectBrands() {
  yield takeLatest(GET_PROJECT_BRANDS_REQUEST, requestProjectAttributes);
}

export default getProjectBrands;

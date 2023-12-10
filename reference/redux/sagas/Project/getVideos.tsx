import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_VIDEOS_OF_PROJECT_REQUEST, setVideosReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { VideoService } from 'services/video';

function* requestGetVideos(data: { type: string,  projectId: number}) {
  try {
    const videoData = yield call(VideoService.getVideos, { projectId: data.projectId, take: 9999 });
    yield put(setVideosReducer(videoData.data))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getVideos() {
  yield takeLatest(GET_VIDEOS_OF_PROJECT_REQUEST, requestGetVideos);
}

export default getVideos;

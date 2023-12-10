import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_CUSTOM_QUESTIONS_OF_PROJECT_REQUEST, setCustomQuestionsReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { CustomQuestionService } from 'services/custom_question';

function* requestGetCustomQuestions(data: { type: string,  projectId: number}) {
  try {
    const res = yield call(CustomQuestionService.findAll, { projectId: data.projectId, take: 9999 });
    yield put(setCustomQuestionsReducer(res.data))
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getCustomQuestions() {
  yield takeLatest(GET_CUSTOM_QUESTIONS_OF_PROJECT_REQUEST, requestGetCustomQuestions);
}

export default getCustomQuestions;

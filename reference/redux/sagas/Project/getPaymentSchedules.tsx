import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_PAYMENT_SCHEDULES_REQUEST, setPaymentSchedulesReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { PaymentScheduleService } from 'services/payment_schedule';
import { PaymentSchedule } from "models/payment_schedule";

function* requestGetPaymentSchedules(data: { type: string,  projectId: number , callback: (data: PaymentSchedule[]) => void}) {
  try {
    const res = yield call(PaymentScheduleService.getPaymentSchedule, { projectId: data.projectId });
    yield put(setPaymentSchedulesReducer(res.data))
    data.callback && data.callback(res.data);
  } catch (e: any) {
    yield put(setErrorMess(e))
  }
}

function* getPaymentSchedules() {
  yield takeLatest(GET_PAYMENT_SCHEDULES_REQUEST, requestGetPaymentSchedules);
}

export default getPaymentSchedules;

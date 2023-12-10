import produce from "immer";
import * as types from "./actionTypes";
import { PaymentSchedule } from "models/payment_schedule";

export interface PaymentScheduleResult {
  isSuccess: boolean;
  paymentSchedule: PaymentSchedule;
}

export interface PaymentState {
  isMakeAnOrder: boolean;
  paymentScheduleResult: PaymentScheduleResult;
}

const initial: PaymentState = {
  isMakeAnOrder: false,
  paymentScheduleResult: null,
};

export const paymentReducer = (state = initial, action: any) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.SET_PAYMENT_IS_MAKE_AN_ORDER_SUCCESS_REDUCER:
        draft.isMakeAnOrder = action.data;
        break;
      case types.SET_PAYMENT_SCHEDULE_RESULT_REDUCER:
        draft.paymentScheduleResult = action.data;
        break;
    }
  });

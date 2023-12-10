import { PaymentScheduleResult } from ".";

export const SET_PAYMENT_IS_MAKE_AN_ORDER_SUCCESS_REDUCER = "SET_PAYMENT_IS_MAKE_AN_ORDER_SUCCESS_REDUCER";
export const SET_PAYMENT_SCHEDULE_RESULT_REDUCER = "SET_PAYMENT_SCHEDULE_RESULT_REDUCER";

export const setPaymentIsMakeAnOrderSuccessReducer = (data: boolean) => {
  return {
    type: SET_PAYMENT_IS_MAKE_AN_ORDER_SUCCESS_REDUCER,
    data: data,
  };
};

export const setPaymentScheduleResultReducer = (data: PaymentScheduleResult) => {
  return {
    type: SET_PAYMENT_SCHEDULE_RESULT_REDUCER,
    data: data,
  };
};
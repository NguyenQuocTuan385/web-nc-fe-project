import { push } from "connected-react-router";
import _ from "lodash";
import QueryString from "query-string";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPaymentScheduleResultReducer } from "redux/reducers/Payment/actionTypes";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import { routes } from "routers/routes";
import { PaymentService } from "services/payment";
import { PaymentScheduleService } from "services/payment_schedule";

export const OnePayCallbackPaymentSchedule = () => {
  const dispatch = useDispatch();
  const params: { [key: string]: any } = QueryString.parse(window.location.search);

  const errorRedirect = (params) => {
    if (params.projectId) {
      dispatch(push(routes.project.detail.paymentBilling.yourNextPayment.replace(":id", params.projectId)));
    } else {
      dispatch(push(routes.project.management));
    }
  };

  const getDetailPaymentSchedule = (params) => {
    return PaymentScheduleService.getDetailPaymentSchedule(params?.paymentScheduleId)
      .then((res) => res)
      .catch((e) => {
        dispatch(setErrorMess(e));
        errorRedirect(params);
      });
  };

  useEffect(() => {
    if (!_.isEmpty(params)) {
      PaymentService.onePayCallbackPaymentSchedule(params)
        .then(async (res) => {
          const paymentSchedule = await getDetailPaymentSchedule(params);
          if (paymentSchedule) {
            dispatch(
              setPaymentScheduleResultReducer({
                isSuccess: true,
                paymentSchedule: paymentSchedule?.data,
              })
            );
          }
          dispatch(push(routes.project.detail.paymentBilling.yourNextPayment.replace(":id", res.project.id)));
        })
        .catch(async (e) => {
          const paymentSchedule = await getDetailPaymentSchedule(params);
          if (paymentSchedule) {
            dispatch(
              setPaymentScheduleResultReducer({
                isSuccess: false,
                paymentSchedule: paymentSchedule?.data,
              })
            );
          }
          dispatch(setErrorMess(e));
          errorRedirect(params);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return null;
};

export default OnePayCallbackPaymentSchedule;

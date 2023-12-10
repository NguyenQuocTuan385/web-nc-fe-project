import { push } from 'connected-react-router';
import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { routes } from 'routers/routes';


export const OnePayPaymentScheduleAgainLinkCallback = () => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id?: string }>()

  useEffect(() => {
    if (id) {
      dispatch(push(routes.project.detail.paymentBilling.yourNextPayment.replace(":id", id)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return null
}

export default OnePayPaymentScheduleAgainLinkCallback
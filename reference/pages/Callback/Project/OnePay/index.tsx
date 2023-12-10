import { push } from 'connected-react-router';
import _ from 'lodash';
import QueryString from 'query-string';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setErrorMess } from 'redux/reducers/Status/actionTypes';
import { routes } from 'routers/routes';
import { PaymentService } from 'services/payment';


export const OnePayCallback = () => {

  const dispatch = useDispatch()
  const params: { [key: string]: any } = QueryString.parse(window.location.search);

  useEffect(() => {
    if(!_.isEmpty(params)) {
      PaymentService.onePayCallback(params)
        .then((res) => {
          dispatch(push(routes.project.detail.paymentBilling.root.replace(':id', res.project.id)))
        })
        .catch((e) => {
          dispatch(setErrorMess(e))
          if (params.projectId) {
            dispatch(push(routes.project.detail.paymentBilling.root.replace(":id", params.projectId)))
          } else {
            dispatch(push(routes.project.management))
          }
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])
  return null
}

export default OnePayCallback
import { memo } from "react";
import { Grid } from "@mui/material"
import Order from "./Order";
import Completed from "./Completed";
import { routes } from "routers/routes";
import { Redirect, Route, Switch } from "react-router-dom";
import ProjectReviewAndPayment from "./ProjectReviewAndPayment";
import Waiting from "./Waiting";
import OnePayFail from "./OnePayFail";
import OnePayPending from "./OnePayPending";
import usePermissions from 'hooks/usePermissions';
import useAuth from "hooks/useAuth";

interface Props {
  projectId: number
}

const PayTab = memo((_: Props) => {
  const { isAllowPayment, id } = usePermissions()
  const { isGuest } = useAuth();

  return (
    <>
      <Switch>
        <Route path={routes.project.detail.paymentBilling.previewAndPayment.root} render={(routeProps) => <ProjectReviewAndPayment {...routeProps} />} />
        <Route
          path={routes.project.detail.paymentBilling.order}
          render={(props) => {
            if (isAllowPayment === null) return null;
            if (isAllowPayment && !isGuest) return <Order {...props} />
            return <Redirect
              to={{
                pathname: routes.project.detail.paymentBilling.previewAndPayment.preview.replace(":id", `${id}`),
                state: {
                  from: props.location
                }
              }}
            />
          }}
        />
        <Route
          path={routes.project.detail.paymentBilling.completed}
          render={(props) => {
            if (isAllowPayment === null) return null;
            if (isAllowPayment && !isGuest) return <Completed {...props} />
            return <Redirect
              to={{
                pathname: routes.project.detail.paymentBilling.previewAndPayment.preview.replace(":id", `${id}`),
                state: {
                  from: props.location
                }
              }}
            />
          }}
        />
        <Route
          path={routes.project.detail.paymentBilling.waiting}
          render={(props) => {
            if (isAllowPayment === null) return null;
            if (isAllowPayment && !isGuest) return <Waiting {...props} />
            return <Redirect
              to={{
                pathname: routes.project.detail.paymentBilling.previewAndPayment.preview.replace(":id", `${id}`),
                state: {
                  from: props.location
                }
              }}
            />
          }}
        />
        <Route
          path={routes.project.detail.paymentBilling.onPayFail}
          render={(props) => {
            if (isAllowPayment === null) return null;
            if (isAllowPayment && !isGuest) return <OnePayFail {...props} />
            return <Redirect
              to={{
                pathname: routes.project.detail.paymentBilling.previewAndPayment.preview.replace(":id", `${id}`),
                state: {
                  from: props.location
                }
              }}
            />
          }}
        />
        <Route
          path={routes.project.detail.paymentBilling.onPayPending}
          render={(props) => {
            if (isAllowPayment === null) return null;
            if (isAllowPayment && !isGuest) return <OnePayPending {...props} />
            return <Redirect
              to={{
                pathname: routes.project.detail.paymentBilling.previewAndPayment.preview.replace(":id", `${id}`),
                state: {
                  from: props.location
                }
              }}
            />
          }}
        />
        <Redirect from={routes.project.detail.paymentBilling.root} to={routes.project.detail.paymentBilling.previewAndPayment.preview} />
      </Switch>
    </>
  )
})

export default PayTab;
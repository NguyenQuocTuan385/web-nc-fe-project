import { memo } from "react";
import { routes } from "routers/routes";
import { Redirect, Route, Switch } from "react-router-dom";
import ProjectReview from "./ProjectReview";
import SelectDate from "./SelectDate";
import YourNextPayment from "./YourNextPayment";
import usePermissions from 'hooks/usePermissions';
import useAuth from "hooks/useAuth";

interface Props {
  projectId: number
}

const PayTab = memo(({ projectId }: Props) => {
  const { isAllowPayment } = usePermissions()
  const { isGuest } = useAuth();

  return (
    <>
      <Switch>
        <Route path={routes.project.detail.paymentBilling.previewAndPayment.preview} render={(routeProps) => <ProjectReview {...routeProps} />} />
        <Route
          exact
          path={routes.project.detail.paymentBilling.previewAndPayment.selectDate}
          render={(props) => {
            if (isAllowPayment === null) return null;
            if (isAllowPayment && !isGuest) return <SelectDate {...props} projectId={Number(projectId)} />
            return <Redirect
              to={{
                pathname: routes.project.detail.paymentBilling.previewAndPayment.preview.replace(":id", `${projectId}`),
                state: {
                  from: props.location
                }
              }}
            />
          }}
        />
        <Route
          exact
          path={routes.project.detail.paymentBilling.yourNextPayment}
          render={(props) => {
            if (isAllowPayment === null) return null;
            if (isAllowPayment && !isGuest) return <YourNextPayment projectId={Number(projectId)} />
            return <Redirect
              to={{
                pathname: routes.project.detail.paymentBilling.previewAndPayment.preview.replace(":id", `${projectId}`),
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
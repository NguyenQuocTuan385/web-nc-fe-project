import { Box, Step, StepConnector, StepLabel, Stepper } from "@mui/material";
import WarningBox from "components/WarningBox";
import QontoStepIcon from "pages/ProjectManagement/components/QontoStepIcon";
import { Content, LeftContent, PageRoot } from "pages/SurveyNew/components";
import { memo, useMemo } from "react"
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { matchPath, Redirect, Route, Switch } from "react-router-dom";
import { ReducerType } from "redux/reducers";
import { routes } from "routers/routes";
import Payment from "../Payment";
import ProjectReview from "../ProjectReview";
import classes from './styles.module.scss';

interface Props {

}

const ProjectReviewAndPayment = memo(({ }: Props) => {
  const { t, i18n } = useTranslation()
  const { cancelPayment } = useSelector((state: ReducerType) => state.project)

  const steps = useMemo(() => {
    return [
      { name: t('payment_billing_sub_tab_preview'), path: routes.project.detail.paymentBilling.previewAndPayment.preview },
      { name: t('payment_billing_sub_tab_payment'), path: routes.project.detail.paymentBilling.previewAndPayment.payment }
    ]
  }, [i18n.language])

  const activeStep = useMemo(() => {
    const activeRoute = (routeName: string, exact: boolean = false) => {
      const match = matchPath(window.location.pathname, {
        path: routeName,
        exact: exact
      })
      return !!match
    };
    const index = steps.findIndex(it => activeRoute(it.path))
    return index === -1 ? 0 : index
  }, [window.location.pathname])

  return (
    <PageRoot>
      <LeftContent>
        <Content className={classes.content}>
          {cancelPayment && (
            <Box className={classes.warningBox}>
              <WarningBox translation-key="payment_billing_sub_tab_preview_warning">
                {t("payment_billing_sub_tab_preview_warning")}
              </WarningBox>
            </Box>
          )}
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            classes={{ root: classes.rootStepper }}
            connector={<StepConnector classes={{ root: classes.rootConnector, active: classes.activeConnector }} />}
          >
            {steps.map((item, index) => {
              return (
                <Step key={index}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    classes={{
                      root: classes.rootStepLabel,
                      completed: classes.rootStepLabelCompleted,
                      active: classes.rootStepLabelActive,
                      label: classes.rootStepLabel
                    }}
                  >{item.name}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <Switch>
            <Route exact path={routes.project.detail.paymentBilling.previewAndPayment.preview} render={(routeProps) => <ProjectReview {...routeProps} />} />
            <Route exact path={routes.project.detail.paymentBilling.previewAndPayment.payment} render={(routeProps) => <Payment {...routeProps} />} />

            <Redirect from={routes.project.detail.paymentBilling.previewAndPayment.root} to={routes.project.detail.paymentBilling.previewAndPayment.preview} />
          </Switch>
        </Content>
      </LeftContent>
    </PageRoot>
  )
})

export default ProjectReviewAndPayment
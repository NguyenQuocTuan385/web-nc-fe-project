import images from "config/images";
import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { authPaymentFail, getPayment } from "../models";
import classes from "./styles.module.scss";
import { Grid } from "@mui/material";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { PaymentService } from "services/payment";
import {
  getProjectRequest,
  setCancelPayment,
} from "redux/reducers/Project/actionTypes";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { ChangePaymentMethodFormData, Payment } from "models/payment";
import ChangePaymentMethod from "pages/SurveyNew/components/ChangePaymentMethod";
import { Content, LeftContent, PageRoot } from "pages/SurveyNew/components";
import Heading1 from "components/common/text/Heading1";
import Heading2 from "components/common/text/Heading2";
import Heading4 from "components/common/text/Heading4";
import { ImageMain } from "../components";
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline";
import Button, { BtnType } from "components/common/buttons/Button";
import PopupConfirmCancelOrder from "pages/SurveyNew/components/PopupConfirmCancelOrder";
import clsx from "clsx";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import { usePrice } from "helpers/price";
import usePermissions from "hooks/usePermissions";

interface Props {}

// eslint-disable-next-line no-empty-pattern
const OnePayFail = memo(({}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { project } = useSelector((state: ReducerType) => state.project);
  const { user, configs } = useSelector((state: ReducerType) => state.user);

  const [isConfirmCancel, setIsConfirmCancel] = useState<boolean>(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState<boolean>(false);

  const payment = useMemo(() => getPayment(project?.payments), [project]);

  const { getCostCurrency } = usePrice()
  
  const { isAllowPayment } = usePermissions()

  useEffect(() => {
    authPaymentFail(project, onRedirect, isAllowPayment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isAllowPayment]);

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  };

  const onCancelPayment = () => {
    dispatch(setLoading(true));
    if (!payment) return;
    PaymentService.cancel(payment.id)
      .then(() => {
        dispatch(setCancelPayment(true));
        dispatch(
          getProjectRequest(project.id, () => {
            onRedirect(
              routes.project.detail.paymentBilling.previewAndPayment.preview
            );
          })
        );
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onShowConfirmCancel = () => {
    setIsConfirmCancel(true);
  };

  const onCloseConfirmCancel = () => {
    setIsConfirmCancel(false);
  };

  const onTryAgain = () => {
    dispatch(setLoading(true));
    if (!payment) return;
    PaymentService.tryAgain(payment.id, {
      projectId: project.id,
      returnUrl: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePay}?projectId=${project.id}`,
      againLink: `${
        process.env.REACT_APP_BASE_URL
      }${routes.callback.project.onePayAgainLink.replace(
        ":id",
        `${project.id}`
      )}`,
    })
      .then((res) => {
        window.location.href = res.checkoutUrl;
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onChangePaymentMethod = (data: ChangePaymentMethodFormData) => {
    dispatch(setLoading(true));
    PaymentService.changePaymentMethod(payment.id, {
      projectId: project.id,
      paymentMethodId: data.paymentMethodId,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      returnUrl: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePay}?projectId=${project.id}`,
      againLink: `${
        process.env.REACT_APP_BASE_URL
      }${routes.callback.project.onePayAgainLink.replace(
        ":id",
        `${project.id}`
      )}`,
    })
      .then((res: { payment: Payment; checkoutUrl: string }) => {
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          dispatch(getProjectRequest(project.id));
        }
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onConfirm = (data: ChangePaymentMethodFormData) => {
    if (!project) return;
    onChangePaymentMethod(data);
  };

  return (
    <PageRoot>
      <LeftContent>
        <Content
          classes={{
            root: clsx(classes.rootContent, {
              [classes.rootContentShowPayment]: showPaymentMethod,
            }),
          }}
        >
          {!showPaymentMethod && (
            <Grid classes={{ root: classes.content }}>
              <ImageMain src={images.imgPayment} alt="" />
              <Heading1
                mb={2}
                $colorName="--cimigo-danger"
                translation-key="payment_billing_fail_title"
              >
                {t("payment_billing_fail_title")}
              </Heading1>
              <Heading2
                mb={1}
                $colorName="--cimigo-green-dark-1"
                translation-key="payment_billing_total_amount"
              >
                {t("payment_billing_total_amount")}: {getCostCurrency(payment?.totalAmount, payment?.currency)?.show}{" "}
              </Heading2>
              <Heading4
                mb={3}
                $colorName="--cimigo-blue-dark-1"
                translation-key="payment_billing_equivalent_to"
              >
                ({t("payment_billing_equivalent_to")}{" "}{getCostCurrency(payment?.totalAmount, payment?.currency)?.equivalent})
              </Heading4>
              <Button
                className={classes.button}
                btnType={BtnType.Outlined}
                children={<TextBtnSmall $colorName="--cimigo-blue" translation-key="payment_billing_try_again">{t("payment_billing_try_again")}</TextBtnSmall>}
                onClick={onTryAgain}
              />
              <ParagraphBodyUnderline
                mt={2}
                onClick={() => setShowPaymentMethod(true)}
                className="cursor-pointer"
                variant="body2"
                variantMapping={{ body2: "span" }}
                translation-key="payment_billing_change_method"
              >
                {t("payment_billing_change_method")}
              </ParagraphBodyUnderline>
              <ParagraphBodyUnderline
                mt={2}
                onClick={onShowConfirmCancel}
                className="cursor-pointer"
                variant="body2"
                variantMapping={{ body2: "span" }}
                translation-key="common_cancel_payment"
              >
                {t("common_cancel_payment")}
              </ParagraphBodyUnderline>
            </Grid>
          )}
          {showPaymentMethod && (
            <ChangePaymentMethod
              project={project}
              user={user}
              configs={configs}
              payment={payment}
              onConfirm={onConfirm}
              onCancelPayment={onCancelPayment}
            />
          )}
          <PopupConfirmCancelOrder
            isOpen={isConfirmCancel}
            onClose={onCloseConfirmCancel}
            onConfirm={onCancelPayment}
          />
        </Content>
      </LeftContent>
    </PageRoot>
  );
});

export default OnePayFail;

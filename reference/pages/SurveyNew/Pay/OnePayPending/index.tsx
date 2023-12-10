import { Grid } from '@mui/material';
import Heading1 from 'components/common/text/Heading1';
import Heading2 from 'components/common/text/Heading2';
import Heading4 from 'components/common/text/Heading4';
import ParagraphBody from 'components/common/text/ParagraphBody';
import ParagraphBodyUnderline from 'components/common/text/ParagraphBodyUnderline';
import images from 'config/images';
import { push } from 'connected-react-router';
import PopupConfirmCancelOrder from 'pages/SurveyNew/components/PopupConfirmCancelOrder';
import { Content, LeftContent, PageRoot } from 'pages/SurveyNew/components';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import { getProjectRequest, setCancelPayment } from 'redux/reducers/Project/actionTypes';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';
import { routes } from 'routers/routes';
import { PaymentService } from 'services/payment';
import { ImageMain } from '../components';
import { authPaymentFail, getPayment } from '../models';
import classes from './styles.module.scss';
import { usePrice } from 'helpers/price';
import usePermissions from "hooks/usePermissions";

interface Props { }

// eslint-disable-next-line no-empty-pattern
const OnePayPending = memo(({ }: Props) => {
  const { t } = useTranslation()

  const dispatch = useDispatch();
  const { project } = useSelector((state: ReducerType) => state.project)
  const [isConfirmCancel, setIsConfirmCancel] = useState<boolean>(false)

  const payment = useMemo(() => getPayment(project?.payments), [project])

  const { getCostCurrency } = usePrice()

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  const { isAllowPayment } = usePermissions()

  useEffect(() => {
    authPaymentFail(project, onRedirect, isAllowPayment)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isAllowPayment])

  const onCancelPayment = () => {
    dispatch(setLoading(true));
    if (!payment) return
    PaymentService.cancel(payment.id)
      .then(() => {
        dispatch(setCancelPayment(true))
        dispatch(getProjectRequest(project.id, () => {
          onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
        }))
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  }

  const onShowConfirmCancel = () => {
    setIsConfirmCancel(true)
  }

  const onCloseConfirmCancel = () => {
    setIsConfirmCancel(false)
  }

  return (
    <PageRoot>
      <LeftContent>
        <Content className={classes.root}>
          <Grid className={classes.content}>
            <ImageMain className={classes.img} src={images.imgPaymentPending} alt="" />
            <Heading1 sx={{ mb: { xs: 3, sm: 2 } }} $colorName="--warning" translation-key="payment_billing_pending_title" align="center">
              {t('payment_billing_pending_title')}
            </Heading1>
            <ParagraphBody sx={{ mb: { xs: 2, sm: 3 } }} $colorName="--eerie-black-00" translation-key="payment_billing_pending_sub" align="center">
              {t('payment_billing_pending_sub')}
            </ParagraphBody>
            <Heading2 mb={1} $fontSizeMobile={"16px"} $lineHeightMobile="24px" $colorName="--cimigo-green-dark-1" translation-key="payment_billing_total_amount" align="center">
              {t('payment_billing_total_amount')}: {getCostCurrency(payment?.totalAmount, payment?.currency)?.show}
            </Heading2>
            <Heading4 mb={{ xs: 3, sm: 4 }} $fontSizeMobile={"12px"} $lineHeightMobile="16px" $colorName="--cimigo-blue-dark-1" translation-key="payment_billing_equivalent_to" align="center">
              ({t('payment_billing_equivalent_to')} {getCostCurrency(payment?.totalAmount, payment?.currency)?.equivalent})
            </Heading4>
            <ParagraphBodyUnderline onClick={onShowConfirmCancel} translation-key="common_cancel_payment" align="center">
              {t("common_cancel_payment")}
            </ParagraphBodyUnderline>
            <PopupConfirmCancelOrder
              isOpen={isConfirmCancel}
              onClose={onCloseConfirmCancel}
              onConfirm={onCancelPayment}
            />
          </Grid>
        </Content>
      </LeftContent>
    </PageRoot>
  )
})
export default OnePayPending
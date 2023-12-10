import { Grid } from "@mui/material";
import classes from './styles.module.scss';
import images from "config/images";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import { authWaiting, getPayment } from "../models";
import { push } from "connected-react-router";
import { useTranslation } from "react-i18next";
import WarningBox from "components/WarningBox";
import PopupInvoiceInformation from "pages/SurveyNew/components/PopupInvoiceInformation";
import { Content, LeftContent, PageRoot } from "pages/SurveyNew/components";
import ParagraphBody from "components/common/text/ParagraphBody";
import { ImageMain, ParagraphBodyBlueNestedA } from "../components";
import Heading1 from "components/common/text/Heading1";
import Heading2 from "components/common/text/Heading2";
import Heading4 from "components/common/text/Heading4";
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline";
import { usePrice } from "helpers/price";
import usePermissions from "hooks/usePermissions"; 

interface Props {

}
// eslint-disable-next-line no-empty-pattern
const Waiting = memo(({ }: Props) => {

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const { project } = useSelector((state: ReducerType) => state.project)

  const { getCostCurrency } = usePrice()

  const unConfirmedPayment = () => {
    dispatch(setLoading(true))
    PaymentService.updateConfirmPayment({
      projectId: project.id,
      userConfirm: false
    })
      .then(() => {
        dispatch(setLoading(false))
        dispatch(getProjectRequest(project.id))
      })
      .catch((e) => {
        dispatch(setErrorMess(e))
        dispatch(setLoading(false))
        return null
      })
  }

  const payment = useMemo(() => getPayment(project?.payments), [project])

  const [isOpenPopupInvoice, setIsOpenPopupInvoice] = useState(false)

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  const { isAllowPayment } = usePermissions()

  useEffect(() => {
    authWaiting(project, onRedirect, isAllowPayment)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isAllowPayment])

  return (
    <PageRoot>
      <LeftContent>
        <Content className={classes.root}>
          <WarningBox sx={{ maxWidth: '946px' }}>
            <span translation-key="payment_billing_waiting_fill_purpose">
              <ParagraphBody
                variant="body2"
                variantMapping={{ body2: "span" }}
                translation-key="payment_billing_waiting_fill_click"
                $colorName="--cimigo-blue"
                className="underline cursor-pointer"
                onClick={() => setIsOpenPopupInvoice(true)}
              >
                {t('payment_billing_waiting_fill_click')}
              </ParagraphBody> {t('payment_billing_waiting_fill_purpose')}
            </span>
          </WarningBox>
          <Grid classes={{ root: classes.content }}>
            <ImageMain src={images.imgPayment} alt="" />
            <Heading1 sx={{ mb: { xs: 3, sm: 2 } }} $colorName="--cimigo-blue" translation-key="payment_billing_waiting_title" align="center">
              {t('payment_billing_waiting_title')}
            </Heading1>
            <Heading2 mb={1} $fontSizeMobile={"16px"} $lineHeightMobile="24px" $colorName="--cimigo-green-dark-1" translation-key="payment_billing_total_amount" align="center">
              {t('payment_billing_total_amount')}: {getCostCurrency(payment?.totalAmount, payment?.currency)?.show}
            </Heading2>
            <Heading4 mb={3} $fontSizeMobile={"12px"} $lineHeightMobile="16px" $colorName="--cimigo-blue-dark-1" translation-key="payment_billing_equivalent_to" align="center">
              ({t('payment_billing_equivalent_to')} {getCostCurrency(payment?.totalAmount, payment?.currency)?.equivalent})
            </Heading4>
            <ParagraphBody sx={{ mb: { xs: 2, sm: 3 } }} $colorName="--eerie-black-00" translation-key="payment_billing_waiting_sub_1" align="center">
              {t('payment_billing_waiting_sub_1')}
            </ParagraphBody>
            <ParagraphBody sx={{ mb: { xs: 2, sm: 3 } }} $colorName="--eerie-black" translation-key="payment_billing_waiting_sub_2" align="center">
              {t('payment_billing_waiting_sub_2')} <ParagraphBodyUnderline onClick={unConfirmedPayment} variant="body2" variantMapping={{ "body2": "span" }} translation-key="payment_billing_waiting_btn_back_transfer">{t('payment_billing_waiting_btn_back_transfer')}</ParagraphBodyUnderline>
            </ParagraphBody>
            <ParagraphBodyBlueNestedA
              $colorName="--eerie-black"
              translation-key="payment_billing_waiting_sub_2"
              align="center"
              dangerouslySetInnerHTML={{ __html: t('payment_billing_waiting_sub_3') }}
            />
            <PopupInvoiceInformation
              payment={payment}
              isOpen={isOpenPopupInvoice}
              onClose={() => setIsOpenPopupInvoice(false)}
            />
          </Grid>
        </Content>
      </LeftContent>
    </PageRoot>

  )
})

export default Waiting;
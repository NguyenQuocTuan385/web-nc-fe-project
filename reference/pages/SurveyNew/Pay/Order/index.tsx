import { Box, Grid } from "@mui/material"
import classes from './styles.module.scss';
import images from "config/images";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { EPaymentMethod } from "models/general";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { getProjectRequest, setCancelPayment } from "redux/reducers/Project/actionTypes";
import { authOrder, getPayment } from "../models";
import { useTranslation } from "react-i18next";
import WarningBox from "components/WarningBox";
import PopupInvoiceInformation from "pages/SurveyNew/components/PopupInvoiceInformation";
import { Content, LeftContent, PageRoot } from "pages/SurveyNew/components";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading1 from "components/common/text/Heading1";
import Heading2 from "components/common/text/Heading2";
import Heading4 from "components/common/text/Heading4";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import { DownLoadItem, ImageMain, InforBox, InforBoxItem } from "../components";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import Heading6 from "components/common/text/Heading6";
import PopupConfirmCancelOrder from "pages/SurveyNew/components/PopupConfirmCancelOrder";
import FileSaver from "file-saver";
import moment from "moment";
import { AttachmentService } from "services/attachment";
import { usePrice } from "helpers/price";
import usePermissions from "hooks/usePermissions";

interface Props {

}

// eslint-disable-next-line no-empty-pattern
const Order = memo(({ }: Props) => {

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const { configs } = useSelector((state: ReducerType) => state.user)

  const { project } = useSelector((state: ReducerType) => state.project)

  const [isConfirmCancel, setIsConfirmCancel] = useState<boolean>(false);

  const payment = useMemo(() => getPayment(project?.payments), [project])

  const { getCostCurrency } = usePrice()

  const [isOpenPopupInvoice, setIsOpenPopupInvoice] = useState(false);
  const confirmedPayment = () => {
    dispatch(setLoading(true))
    PaymentService.updateConfirmPayment({
      projectId: project.id,
      userConfirm: true
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

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  const { isAllowPayment } = usePermissions()

  useEffect(() => {
    authOrder(project, onRedirect, isAllowPayment)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isAllowPayment]);


  const onShowConfirmCancel = () => {
    setIsConfirmCancel(true);
  }

  const onCloseConfirmCancel = () => {
    setIsConfirmCancel(false);
  }

  const onCancelPayment = () => {
    dispatch(setLoading(true));
    if (!payment) return;
    PaymentService.cancel(payment.id)
      .then(() => {
        dispatch(setCancelPayment(true))
        dispatch(getProjectRequest(project.id, () => {
          onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview);
        }))
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  }

  const getInvoice = () => {
    if (!project || !payment) return
    dispatch(setLoading(true))
    PaymentService.getInvoiceDemo(project.id, payment.id)
      .then(res => {
        FileSaver.saveAs(res.data, `invoice-${moment().format('MM-DD-YYYY-hh-mm-ss')}.pdf`)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onDownloadContract = () => {
    if (!configs.viewContract) return
    dispatch(setLoading(true))
    AttachmentService.getDetail(configs.viewContract)
      .then(attachment => {
        AttachmentService.download(configs.viewContract)
        .then(res => {
          FileSaver.saveAs(res.data, attachment.fileName)
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
      })
      .catch((e) => {
        dispatch(setLoading(false))
        dispatch(setErrorMess(e))
      })
  }

  const render = () => {
    switch (payment?.paymentMethodId) {
      case EPaymentMethod.MAKE_AN_ORDER:
        return (
          <>
            <ParagraphBody sx={{ mt: 1, mb: { xs: 2, sm: 4 } }} $colorName="--eerie-black" translation-key="payment_billing_order_make_an_order_sub_1">
              {t('payment_billing_order_make_an_order_sub_1')}
            </ParagraphBody>
            <InforBox sx={{ width: "auto !important" }}>
              <Grid container>
                <InforBoxItem item xs={12}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_name">{t('payment_billing_name')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black">{payment?.contactName}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={12} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_phone">{t('payment_billing_phone')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black">{payment?.contactPhone}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={12} sm={8}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_email">{t('payment_billing_email')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black">{payment?.contactEmail}</Heading6>
                </InforBoxItem>
              </Grid>
            </InforBox>
            <ParagraphBody
              sx={{ mb: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 4 } }}
              className={classes.greenSpan}
              $colorName="--eerie-black"
              translation-key="payment_billing_order_bank_transfer_sub_3"
              dangerouslySetInnerHTML={{ __html: t('payment_billing_order_bank_transfer_sub_3', { total: getCostCurrency(payment?.totalAmount, payment?.currency)?.USDShow }) }}
            />
            <InforBox>
              <Grid container>
                <InforBoxItem item xs={12}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_bank_name">{t('payment_billing_bank_name')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_bank_name_name">{t('payment_billing_bank_name_name')}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_beneficiary">{t('payment_billing_beneficiary')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_beneficiary_name">{t("payment_billing_beneficiary_name")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_account_number">{t('payment_billing_account_number')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_account_number_bank">{t("payment_billing_account_number_bank")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_SWIFT_code">{t('payment_billing_SWIFT_code')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_SWIFT_code_name">{t("payment_billing_SWIFT_code_name")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_currency">{t('payment_billing_currency')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_currency_USD">{t("payment_billing_currency_USD")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={12} sm={8}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_payment_reference">{t('payment_billing_payment_reference')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black">{payment?.orderId}</Heading6>
                </InforBoxItem>
              </Grid>
            </InforBox>
            <ParagraphBody
              sx={{ my: { xs: 2, sm: 3 } }}
              className={classes.greenSpan}
              $colorName="--eerie-black"
              translation-key="payment_billing_order_bank_transfer_sub_4"
              dangerouslySetInnerHTML={{ __html: t('payment_billing_order_bank_transfer_sub_4', { total: getCostCurrency(payment?.totalAmount, payment?.currency)?.VNDShow }) }}
            />
            <InforBox>
              <Grid container>
                <InforBoxItem item xs={12}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_bank_name">{t('payment_billing_bank_name')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_bank_name_name">{t('payment_billing_bank_name_name')}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_beneficiary">{t('payment_billing_beneficiary')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_beneficiary_name">{t("payment_billing_beneficiary_name")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_account_number">{t('payment_billing_account_number')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_account_number_bank">{t("payment_billing_account_number_bank")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_currency">{t('payment_billing_currency')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_currency_VND">{t("payment_billing_currency_VND")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={12}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_payment_reference">{t('payment_billing_payment_reference')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black">{payment?.orderId}</Heading6>
                </InforBoxItem>
              </Grid>
            </InforBox>
            <ParagraphBody
              sx={{ mt: 2 }}
              $colorName="--eerie-black"
              className={classes.blueA}
              translation-key="payment_billing_order_make_an_order_sub_2"
              dangerouslySetInnerHTML={{ __html: t('payment_billing_order_make_an_order_sub_2') }}
            />
          </>
        )
      case EPaymentMethod.BANK_TRANSFER:
        return (
          <>
            <Heading2 $fontSizeMobile={"16px"} $lineHeightMobile="24px" className={classes.price} $colorName="--cimigo-green-dark-1" translation-key="payment_billing_total_amount">
              {t('payment_billing_total_amount')}: {getCostCurrency(payment?.totalAmount, payment?.currency)?.show}
            </Heading2>
            <Heading4 $fontSizeMobile={"12px"} $lineHeightMobile="16px" className={classes.priceSub} $colorName="--cimigo-blue-dark-1">
              ({t('payment_billing_equivalent_to')} {getCostCurrency(payment?.totalAmount, payment?.currency)?.equivalent})
            </Heading4>
            <ParagraphBody className={classes.titleSub} $colorName="--eerie-black-00" translation-key="payment_billing_order_bank_transfer_sub_1">
              {t('payment_billing_order_bank_transfer_sub_1')}
            </ParagraphBody>
            <Button
              className={classes.btnConfirm}
              btnType={BtnType.Outlined}
              onClick={confirmedPayment}
            >
              <TextBtnSmall translation-key="payment_billing_order_bank_transfer_btn_confirm">
                {t('payment_billing_order_bank_transfer_btn_confirm')}
              </TextBtnSmall>
            </Button>
            <ParagraphBody sx={{ mb: { xs: 2, sm: 3 } }} $colorName="--eerie-black" translation-key="payment_billing_order_bank_transfer_sub_2">{t('payment_billing_order_bank_transfer_sub_2')}</ParagraphBody>
            <ParagraphBody
              sx={{ mb: 2 }}
              className={classes.greenSpan}
              $colorName="--eerie-black"
              translation-key="payment_billing_order_bank_transfer_sub_3"
              dangerouslySetInnerHTML={{ __html: t('payment_billing_order_bank_transfer_sub_3', { total: getCostCurrency(payment?.totalAmount, payment?.currency)?.USDShow }) }}
            />
            <InforBox>
              <Grid container>
                <InforBoxItem item xs={12}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_bank_name">{t('payment_billing_bank_name')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_bank_name_name">{t('payment_billing_bank_name_name')}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_beneficiary">{t('payment_billing_beneficiary')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_beneficiary_name">{t("payment_billing_beneficiary_name")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_account_number">{t('payment_billing_account_number')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_account_number_bank">{t("payment_billing_account_number_bank")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_SWIFT_code">{t('payment_billing_SWIFT_code')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_SWIFT_code_name">{t("payment_billing_SWIFT_code_name")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_currency">{t('payment_billing_currency')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_currency_USD">{t("payment_billing_currency_USD")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={12} sm={8}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_payment_reference">{t('payment_billing_payment_reference')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black">{payment?.orderId}</Heading6>
                </InforBoxItem>
              </Grid>
            </InforBox>
            <ParagraphBody
              sx={{ my: { xs: 2, sm: 3 } }}
              className={classes.greenSpan}
              $colorName="--eerie-black"
              translation-key="payment_billing_order_bank_transfer_sub_4"
              dangerouslySetInnerHTML={{ __html: t('payment_billing_order_bank_transfer_sub_4', { total: getCostCurrency(payment?.totalAmount, payment?.currency)?.VNDShow }) }}
            />
            <InforBox>
              <Grid container>
                <InforBoxItem item xs={12}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_bank_name">{t('payment_billing_bank_name')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_bank_name_name">{t('payment_billing_bank_name_name')}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_beneficiary">{t('payment_billing_beneficiary')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_beneficiary_name">{t("payment_billing_beneficiary_name")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_account_number">{t('payment_billing_account_number')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_account_number_bank">{t("payment_billing_account_number_bank")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={4}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_currency">{t('payment_billing_currency')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black" translation-key="payment_billing_currency_VND">{t("payment_billing_currency_VND")}</Heading6>
                </InforBoxItem>
                <InforBoxItem item xs={6} sm={12}>
                  <ParagraphExtraSmall $colorName="--cimigo-green-dark-3" translation-key="payment_billing_payment_reference">{t('payment_billing_payment_reference')}</ParagraphExtraSmall>
                  <Heading6 $colorName="--eerie-black">{payment?.orderId}</Heading6>
                </InforBoxItem>
              </Grid>
            </InforBox>
            <ParagraphBody sx={{ my: { xs: 2, sm: 3 } }} $colorName="--eerie-black" translation-key="payment_billing_order_bank_transfer_sub_5">
              {t('payment_billing_order_bank_transfer_sub_5')}
            </ParagraphBody>
            <ParagraphBody
              className={classes.blueA}
              $colorName="--eerie-black"
              translation-key="payment_billing_order_bank_transfer_sub_6"
              dangerouslySetInnerHTML={{ __html: t('payment_billing_order_bank_transfer_sub_6') }}
            />
          </>
        )
    }
  }

  return (
    <PageRoot>
      <LeftContent>
        <Content className={classes.root}>
          <WarningBox sx={{ maxWidth: '946px' }}>
            <span translation-key="payment_billing_order_fill_purpose">
              <ParagraphBody
                variant="body2"
                variantMapping={{ body2: "span" }}
                translation-key="payment_billing_order_fill_click"
                $colorName="--cimigo-blue"
                className="underline cursor-pointer"
                onClick={() => setIsOpenPopupInvoice(true)}
              >
                {t('payment_billing_order_fill_click')}
              </ParagraphBody> {t('payment_billing_order_fill_purpose')}
            </span>
          </WarningBox>
          <Grid className={classes.content}>
            <ImageMain src={images.imgOrder} alt="" />
            <Heading1 className={classes.title} $colorName="--cimigo-blue" translation-key="payment_billing_order_title">{t('payment_billing_order_title')}</Heading1>
            {render()}
            <Box py={3} display="flex" justifyContent="center" alignItems="center">
              <DownLoadItem onClick={getInvoice}>
                <img className={classes.imgAddPhoto} src={images.icInvoice} alt=''/>
                <ParagraphBody $colorName="--cimigo-blue" translation-key="pay_order_download_invoice">{t("pay_order_download_invoice")}</ParagraphBody>
              </DownLoadItem>
              {!!configs?.viewContract && (
                <DownLoadItem onClick={onDownloadContract}>
                  <img className={classes.imgAddPhoto} src={images.icContract} alt=''/>
                  <ParagraphBody $colorName="--cimigo-blue" translation-key="payment_billing_view_contract">{t("payment_billing_view_contract")}</ParagraphBody>
                </DownLoadItem>
              )}
            </Box>
            <ParagraphBody
              align="center"
              $colorName="--cimigo-blue"
              className="cursor-pointer"
              translation-key="common_cancel_payment"
              onClick={onShowConfirmCancel}
            >
              {t("common_cancel_payment")}
            </ParagraphBody>
          </Grid>
          <PopupInvoiceInformation
            payment={payment}
            isOpen={isOpenPopupInvoice}
            onClose={() => setIsOpenPopupInvoice(false)}
          />
          <PopupConfirmCancelOrder
            isOpen={isConfirmCancel}
            onClose={onCloseConfirmCancel}
            onConfirm={onCancelPayment}
          />
        </Content>
      </LeftContent>
    </PageRoot>
  )
})

export default Order
import { memo, useEffect, useMemo, useState } from "react";
import { Box, Collapse, Divider, FormControlLabel, Grid, IconButton, Radio, RadioGroup, useMediaQuery, useTheme } from "@mui/material"
import classes from './styles.module.scss';
import images from "config/images";
import InputSelect from "components/common/inputs/InputSelect";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { usePrice } from "helpers/price";
import { EPaymentMethod, OptionItem } from "models/general";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import CountryService from "services/country";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { PaymentService } from "services/payment";
import { Payment } from "models/payment";
import UserService from "services/user";
import { PaymentInfo } from "models/payment_info";
import { getProjectRequest, setCancelPayment } from "redux/reducers/Project/actionTypes";
import { push } from "connected-react-router";
import { authPreviewOrPayment } from "../models";
import { routes } from "routers/routes";
import { useTranslation } from "react-i18next";
import { VALIDATION } from "config/constans";
import { ExpandMore, InfoOutlined } from "@mui/icons-material";
import TooltipCustom from "components/Tooltip";
import PopupConfirmInvoiceInfo from "pages/SurveyNew/components/PopupConfirmInvoiceInfo";
import Heading5 from "components/common/text/Heading5";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import InputTextField from "components/common/inputs/InputTextfield";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import Heading2 from "components/common/text/Heading2";
import Heading6 from "components/common/text/Heading6";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import PopupConfirmCancelOrder from "pages/SurveyNew/components/PopupConfirmCancelOrder";
import { AttachmentService } from "services/attachment";
import FileSaver from 'file-saver';
import moment from "moment";
import { ESOLUTION_TYPE } from "models/solution";
import usePermissions from "hooks/usePermissions";

interface DataForm {
  paymentMethodId: number,
  contactName: string,
  contactEmail: string,
  contactPhone: string,
  saveForLater: boolean,
  fullName: string,
  companyName: string,
  title: string,
  email: string,
  phone: string,
  countryId: OptionItem,
  companyAddress: string,
  taxCode: string
}

interface PaymentProps {
}

// eslint-disable-next-line no-empty-pattern
const PaymentPage = memo(({ }: PaymentProps) => {
  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      paymentMethodId: yup.number(),
      contactName: yup.string()
        .when('paymentMethodId', {
          is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
          then: yup.string().required(t('field_contact_name_vali_required')),
          otherwise: yup.string()
        }),
      contactEmail: yup.string().email()
        .when('paymentMethodId', {
          is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
          then: yup.string().email(t('field_contact_email_vali_email')).required(t('field_contact_email_vali_required')),
          otherwise: yup.string().email(t('field_contact_email_vali_email'))
        }),
      contactPhone: yup.string()
        .when('paymentMethodId', {
          is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
          then: yup.string().matches(VALIDATION.phone, { message: t('field_contact_phone_number_vali_phone'), excludeEmptyString: true }).required(t('field_contact_phone_vali_required')),
          otherwise: yup.string().matches(VALIDATION.phone, { message: t('field_contact_phone_number_vali_phone'), excludeEmptyString: true })
        }),

      saveForLater: yup.bool(),
      fullName: yup.string()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.string().required(t('field_full_name_vali_required')),
          otherwise: yup.string()
        }),
      companyName: yup.string()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.string().required(t('field_company_vali_required')),
          otherwise: yup.string()
        }),
      title: yup.string()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.string().required(t('field_your_title_vali_required')),
          otherwise: yup.string()
        }),
      email: yup.string()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.string().email(t('field_email_vali_email')).required(t('field_email_vali_required')),
          otherwise: yup.string().email(t('field_email_vali_email'))
        }),
      phone: yup.string()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.string().matches(VALIDATION.phone, { message: t('field_phone_number_vali_phone'), excludeEmptyString: true }).required(t('field_phone_number_vali_required')),
          otherwise: yup.string().matches(VALIDATION.phone, { message: t('field_phone_number_vali_phone'), excludeEmptyString: true })
        }),
      countryId: yup.object()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.object().required(t('field_country_vali_required')),
          otherwise: yup.object()
        }),
      companyAddress: yup.string()
        .when('saveForLater', {
          is: (val: boolean) => val,
          then: yup.string().required(t('field_company_address_vali_required')),
          otherwise: yup.string()
        }),
      taxCode: yup.string(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])


  const { register, handleSubmit, control, formState: { errors }, watch, clearErrors, reset, setValue } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      saveForLater: true,
      paymentMethodId: null
    }
  });

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch()
  const { project } = useSelector((state: ReducerType) => state.project)
  const { user, configs } = useSelector((state: ReducerType) => state.user)

  const [countries, setCountries] = useState<OptionItem[]>([])
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>()
  const [showSkipInfor, setShowSkipInfor] = useState<DataForm>()
  const [isConfirmCancel, setIsConfirmCancel] = useState<boolean>(false)
  const [isExpandedInfo, setIsExpandedInfo] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true))
      await Promise.all([
        CountryService.getCountries({ take: 9999 }),
        UserService.getPaymentInfo()
      ])
        .then(res => {
          setCountries(res[0].data)
          setPaymentInfo(res[1])
        })
      dispatch(setLoading(false))
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    if (!paymentInfo && !user) return
    let countryId: OptionItem = undefined
    if (user?.country) {
      countryId = { id: user.country.id, name: user.country.name }
    }
    if (paymentInfo?.country) {
      countryId = { id: paymentInfo.country.id, name: paymentInfo.country.name }
    }
    reset({
      paymentMethodId: null,
      contactName: user?.fullName || '',
      contactEmail: user?.email || '',
      contactPhone: user?.phone || '',
      saveForLater: true,
      fullName: paymentInfo?.fullName || user?.fullName || '',
      companyName: paymentInfo?.companyName || user?.company || '',
      title: paymentInfo?.title || user?.title || '',
      email: paymentInfo?.email || user?.email || '',
      phone: paymentInfo?.phone || user?.phone || '',
      countryId: countryId,
      companyAddress: paymentInfo?.companyAddress || '',
      taxCode: paymentInfo?.taxCode || ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentInfo, user])

  const { price } = usePrice()

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      switch (name) {
        case 'paymentMethodId':
          if (value.paymentMethodId !== EPaymentMethod.MAKE_AN_ORDER) {
            clearErrors(["contactEmail", "contactName", "contactPhone"])
          }
          break;
        case 'saveForLater':
          if (!value.saveForLater) {
            clearErrors(["fullName", "companyName", "email", "phone", "countryId", "companyAddress", "taxCode"])
          }
          break;
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const checkHaveShowSkipInfor = (data: DataForm) => {
    if ([EPaymentMethod.ONEPAY_GENERAL].includes(data.paymentMethodId)) {
      return !data.fullName || !data.companyName || !data.email || !data.phone || !data.countryId || !data.companyAddress
    }
    return false
  }

  const onCheckout = (data: DataForm) => {
    dispatch(setLoading(true))
    PaymentService.checkout({
      projectId: project.id,
      paymentMethodId: data.paymentMethodId,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      saveForLater: data.saveForLater,
      fullName: data.fullName,
      companyName: data.companyName,
      title: data.title,
      email: data.email,
      phone: data.phone,
      countryId: data.countryId?.id,
      companyAddress: data.companyAddress,
      taxCode: data.taxCode,
      returnUrl: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePay}?projectId=${project.id}`,
      againLink: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePayAgainLink.replace(':id', `${project.id}`)}`
    })
      .then((res: { payment: Payment, checkoutUrl: string }) => {
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl
        } else {
          dispatch(getProjectRequest(project.id))
        }
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onConfirm = (data: DataForm) => {
    if (!project) return
    if (checkHaveShowSkipInfor(data)) {
      setShowSkipInfor(data)
      return
    }
    onCheckout(data)
  }

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  useEffect(() => {
    const checkValidConfirm = () => {
      if (!project) return
      dispatch(setLoading(true))
      PaymentService.validConfirm(project.id)
        .then(res => {
          if (!res) onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    checkValidConfirm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  const { isAllowPayment } = usePermissions()

  useEffect(() => {
    authPreviewOrPayment(project, onRedirect, isAllowPayment)
  }, [project, isAllowPayment])


  const onSkipUpdateInfo = () => {
    if (!showSkipInfor) return
    onCheckout(showSkipInfor)
    setShowSkipInfor(null)
  }

  const onUpdateInfo = () => {
    setShowSkipInfor(null)
    scrollToElement('payment_invoice_and_contract_info')
  }

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const headerHeight = document.getElementById('header')?.offsetHeight || 0
    window.scrollTo({ behavior: 'smooth', top: el.offsetTop - headerHeight - 10 })
  }

  const onCancelPayment = () => {
    dispatch(setCancelPayment(true))
    onRedirect(routes.project.detail.paymentBilling.previewAndPayment.preview)
  }

  const onShowConfirmCancel = () => {
    setIsConfirmCancel(true)
  }

  const onCloseConfirmCancel = () => {
    setIsConfirmCancel(false)
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
  
  const renderEmotion = () => {
    switch (project?.solution?.typeId) {
      case ESOLUTION_TYPE.PACK:
        return (
          <ParagraphBody $colorName="--eerie-black" translation-key="payment_project_order_summary_eye_tracking">
            {t("payment_project_order_summary_eye_tracking")} ({project?.eyeTrackingSampleSize || 0})
          </ParagraphBody>
        )
      case ESOLUTION_TYPE.VIDEO_CHOICE:
        return (
          <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_project_order_summary_eye_tracking_video_choice">
          {t('payment_project_order_summary_eye_tracking_video_choice')} ({project?.eyeTrackingSampleSize || 0})
          </ParagraphBody>
        )
    }
  }
  return (
    <Grid component={'form'} classes={{ root: classes.root }} onSubmit={handleSubmit(onConfirm)} noValidate autoComplete="off">
      <Divider className={classes.divider1} />
      <Grid classes={{ root: classes.left }}>
        <Heading5 className={classes.heading1} $colorName="--cimigo-blue" translation-key="payment_billing_sub_tab_payment_method">{t('payment_billing_sub_tab_payment_method')}:</Heading5>
        <Controller
          name="paymentMethodId"
          control={control}
          render={({ field }) => <RadioGroup
            name={field.name}
            value={field.value}
            ref={field.ref}
            onBlur={field.onBlur}
            classes={{ root: classes.radioGroup }}
          >
            <Box className={classes.lable}>
              <Radio
                checked={field.value === EPaymentMethod.BANK_TRANSFER}
                onChange={() => setValue("paymentMethodId", EPaymentMethod.BANK_TRANSFER)}
                classes={{ root: classes.rootRadio, checked: classes.checkRadio }}
              />
              <Grid classes={{ root: classes.order }}>
                <ParagraphBody
                  $colorName="--cimigo-blue"
                  className={classes.title}
                  onClick={() => setValue("paymentMethodId", EPaymentMethod.BANK_TRANSFER)}
                  translation-key="payment_billing_sub_tab_payment_method_bank_transfer"
                >
                  <img src={images.icBank} alt="" />{t('payment_billing_sub_tab_payment_method_bank_transfer')}
                </ParagraphBody>
                <ParagraphSmall
                  $colorName="--gray-80"
                  className={classes.titleSub}
                  translation-key="payment_billing_sub_tab_payment_method_bank_transfer_sub"
                >
                  {t("payment_billing_sub_tab_payment_method_bank_transfer_sub")}
                </ParagraphSmall>
              </Grid>
            </Box>
            <Box className={classes.lable} my={2}>
              <Radio
                checked={field.value === EPaymentMethod.ONEPAY_GENERAL}
                onChange={() => setValue("paymentMethodId", EPaymentMethod.ONEPAY_GENERAL)}
                classes={{ root: classes.rootRadio, checked: classes.checkRadio }}
              />
              <Grid classes={{ root: classes.order }}>
                <ParagraphBody
                  $colorName="--cimigo-blue"
                  className={classes.title}
                  onClick={() => setValue("paymentMethodId", EPaymentMethod.ONEPAY_GENERAL)}
                  translation-key="payment_billing_sub_tab_payment_method_onepay"
                >
                  <img src={images.icInternetBanking} alt="" />{t("payment_billing_sub_tab_payment_method_onepay")}
                </ParagraphBody>
                <Grid className={classes.methodImg}>
                  <img src={images.imgVisa} alt="" />
                  <img src={images.imgMastercard} alt="" />
                  <img src={images.imgAmericanExpress} alt="" />
                  <img src={images.imgJCB} alt="" />
                  <img src={images.imgUnionpay} alt="" />
                </Grid>
                <ParagraphSmall
                  $colorName="--gray-80"
                  className={classes.titleSub}
                  translation-key="payment_billing_sub_tab_payment_method_onepay_sub"
                >
                  {t("payment_billing_sub_tab_payment_method_onepay_sub")}
                </ParagraphSmall>
              </Grid>
            </Box>
            <Box className={classes.lable}>
              <Radio
                checked={field.value === EPaymentMethod.MAKE_AN_ORDER}
                onChange={() => setValue("paymentMethodId", EPaymentMethod.MAKE_AN_ORDER)}
                classes={{ root: classes.rootRadio, checked: classes.checkRadio }}
              />
              <Grid classes={{ root: classes.order }}>
                <ParagraphBody
                  $colorName="--cimigo-blue"
                  className={classes.title}
                  translation-key="payment_billing_sub_tab_payment_method_make_an_order"
                  onClick={() => setValue("paymentMethodId", EPaymentMethod.MAKE_AN_ORDER)}
                >
                  <img src={images.icOrder} alt="" />{t('payment_billing_sub_tab_payment_method_make_an_order')}
                </ParagraphBody>
                <ParagraphSmall
                  $colorName="--gray-80"
                  className={classes.titleSub}
                  sx={{ mb: "16px !important" }}
                  translation-key="payment_billing_sub_tab_payment_method_make_an_order_sub"
                >
                  {t('payment_billing_sub_tab_payment_method_make_an_order_sub')}
                </ParagraphSmall>
                {Number(watch("paymentMethodId")) === EPaymentMethod.MAKE_AN_ORDER && (
                  <Box mb={4} sx={{ maxWidth: "325px" }}>
                    <InputTextField
                      title={t('field_contact_name')}
                      translation-key="field_contact_name"
                      name="contactName"
                      placeholder={t('field_contact_name_placeholder')}
                      translation-key-placeholder="field_contact_name_placeholder"
                      inputRef={register('contactName')}
                      errorMessage={errors.contactName?.message}
                      rootProps={{ sx: { mb: 1 } }}
                    />
                    <InputTextField
                      title={t('field_contact_email')}
                      translation-key="field_contact_email"
                      name="contactEmail"
                      placeholder={t('field_contact_email_placeholder')}
                      translation-key-placeholder="field_contact_email_placeholder"
                      inputRef={register('contactEmail')}
                      errorMessage={errors.contactEmail?.message}
                      rootProps={{ sx: { mb: 1 } }}
                    />
                    <InputTextField
                      title={t('field_contact_phone')}
                      translation-key="field_contact_phone"
                      name="contactPhone"
                      placeholder={t('field_contact_phone_placeholder')}
                      translation-key-placeholder="field_contact_phone_placeholder"
                      inputRef={register('contactPhone')}
                      errorMessage={errors.contactPhone?.message}
                    />
                  </Box>
                )}
              </Grid>
            </Box>
            <Divider />
          </RadioGroup>
          }
        />
        <Box
          mb={2}
          className={classes.paddingMobile}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ cursor: isMobile && "pointer" }}
          onClick={() => isMobile && setIsExpandedInfo((pre) => !pre)}
        >
          <Box>
            <ParagraphExtraSmall className={classes.isMobile} $colorName="--cimigo-green-dark-1" translation-key="common_optional">({t('common_optional')})</ParagraphExtraSmall>
            <Heading5
              id="payment_invoice_and_contract_info"
              $colorName="--cimigo-blue"
              className={classes.titleInfo}
              translation-key="payment_billing_sub_tab_payment_invoice_and_contract_info"
            >
              {t('payment_billing_sub_tab_payment_invoice_and_contract_info')} <ParagraphExtraSmall className={classes.notMobile} ml={1} variant="body2" variantMapping={{ body2: "span" }} $colorName="--cimigo-green-dark-1" translation-key="common_optional">({t('common_optional')})</ParagraphExtraSmall>
            </Heading5>
            <ParagraphExtraSmall className={classes.titleSub1} $colorName={"--gray-60"} translation-key="payment_billing_sub_tab_payment_invoice_and_contract_info_sub">
              {t('payment_billing_sub_tab_payment_invoice_and_contract_info_sub')}
            </ParagraphExtraSmall>
          </Box>
          <IconButton
            sx={{ transform: isExpandedInfo ? "rotate(180deg)" : "unset" }}
            className={classes.isMobile}
          >
            <ExpandMore sx={{ fontSize: 24, color: "var(--eerie-black-40)" }} />
          </IconButton>
        </Box>
        <Collapse in={isExpandedInfo || !isMobile} timeout="auto" unmountOnExit>
          <div className={classes.informationBox}>
            <Grid container rowSpacing={1} columnSpacing={3}>
              <Grid item xs={12} sm={6}>
                <InputTextField
                  title={t('field_full_name')}
                  translation-key="field_full_name"
                  placeholder={t('field_full_name_placeholder')}
                  translation-key-placeholder="field_full_name_placeholder"
                  name="fullName"
                  inputRef={register('fullName')}
                  errorMessage={errors.fullName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputTextField
                  title={t('field_company')}
                  translation-key="field_company"
                  placeholder={t('field_company_placeholder')}
                  translation-key-placeholder="field_company_placeholder"
                  name="companyName"
                  inputRef={register('companyName')}
                  errorMessage={errors.companyName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <InputTextField
                  title={t('field_your_title')}
                  translation-key="field_your_title"
                  placeholder={t('field_your_title_placeholder')}
                  translation-key-placeholder="field_your_title_placeholder"
                  name="title"
                  inputRef={register('title')}
                  errorMessage={errors.title?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <InputTextField
                  title={t('field_email')}
                  translation-key="field_email"
                  placeholder={t('field_email_placeholder')}
                  translation-key-placeholder="field_email_placeholder"
                  name="email"
                  inputRef={register('email')}
                  errorMessage={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputTextField
                  title={t('field_phone_number')}
                  translation-key="field_phone_number"
                  placeholder={t('field_phone_number_placeholder')}
                  translation-key-placeholder="field_phone_number_placeholder"
                  name="phone"
                  inputRef={register('phone')}
                  errorMessage={errors.phone?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputSelect
                  fullWidth
                  title={t('field_country')}
                  name="countryId"
                  control={control}
                  errorMessage={(errors.countryId as any)?.message}
                  selectProps={{
                    options: countries,
                    placeholder: t('field_country_placeholder')
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <InputTextField
                  title={t('field_company_address')}
                  translation-key="field_company_address"
                  placeholder={t('field_company_address_placeholder')}
                  translation-key-placeholder="field_company_address_placeholder"
                  name="companyAddress"
                  inputRef={register('companyAddress')}
                  errorMessage={errors.companyAddress?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <InputTextField
                  optional
                  title={t('field_tax_code_for_invoice')}
                  translation-key="field_tax_code_for_invoice"
                  placeholder={t('field_tax_code_for_invoice_placeholder')}
                  translation-key-placeholder="field_tax_code_for_invoice_placeholder"
                  name="taxCode"
                  inputRef={register('taxCode')}
                  errorMessage={errors.taxCode?.message}
                />
              </Grid>
              <Grid item xs={12} className={classes.tips}>
                <FormControlLabel
                  control={
                    <Controller
                      name="saveForLater"
                      control={control}
                      render={({ field }) =>
                        <InputCheckbox
                          checked={field.value}
                          onChange={field.onChange}
                        />}
                    />
                  }
                  translation-key="payment_billing_sub_tab_payment_save_for_later"
                  label={<>{t('payment_billing_sub_tab_payment_save_for_later')}</>}
                />
                <TooltipCustom popperClass={classes.popperClass} title={t('payment_billing_sub_tab_payment_save_for_later_tip')} translation-key="payment_billing_sub_tab_payment_save_for_later_tip">
                  <InfoOutlined sx={{ ml: 0.5, fontSize: 16, color: "var(--eerie-black-40)" }} />
                </TooltipCustom>
              </Grid>
              {!!configs?.viewContract && (
                <Grid item xs={12}>
                  <ParagraphSmall mt={2} $colorName="--eerie-black-65" translation-key="payment_invoice_and_contract_info_bottom_1">{t("payment_invoice_and_contract_info_bottom_1")} <span onClick={onDownloadContract} className="underline cursor-pointer" translation-key="payment_invoice_and_contract_info_bottom_2">{t("payment_invoice_and_contract_info_bottom_2")}</span></ParagraphSmall>
                </Grid>
              )}
            </Grid>
          </div>
        </Collapse>
        <Divider className={classes.divider1} />
      </Grid>
      <Grid classes={{ root: classes.right }}>
        <Grid classes={{ root: classes.sumaryBox }}>
          <Grid classes={{ root: classes.bodyOrder }}>
            <Heading2 className={classes.sumaryTitle} $colorName="--cimigo-blue" translation-key="payment_billing_sub_tab_payment_summary">
              {t('payment_billing_sub_tab_payment_summary')}
            </Heading2>
            <div className={classes.flexOrder}>
              <ParagraphBody $colorName="--eerie-black" translation-key="common_sample_size">
                {t('common_sample_size')} {`(${project?.sampleSize || 0})`}
              </ParagraphBody>
              <ParagraphBody variant="tabular_nums" $colorName="--eerie-black">{price?.sampleSizeCost?.show}</ParagraphBody>
            </div>
            {project?.customQuestions?.length > 0 && (
              <div className={classes.flexOrder}>
                <ParagraphBody $colorName="--eerie-black" translation-key="common_custom_question">
                  {t("common_custom_question")} {`(${(project?.customQuestions?.length) || 0})`}
                </ParagraphBody>
                <ParagraphBody variant="tabular_nums" $colorName="--eerie-black">{price?.customQuestionCost?.show}</ParagraphBody>
              </div>
            )}
            {project?.enableEyeTracking && (
              <div className={classes.flexOrder}>
                {renderEmotion()}
                <ParagraphBody variant="tabular_nums" $colorName="--eerie-black">{price?.eyeTrackingSampleSizeCost?.show}</ParagraphBody>
              </div>
            )}
            <Divider />
            <div className={classes.flexOrder}>
              <ParagraphBody $colorName="--eerie-black" translation-key="common_vat">
                {t('common_sub_total')}
              </ParagraphBody>
              <ParagraphBody variant="tabular_nums" $colorName="--eerie-black">{price?.amountCost?.show}</ParagraphBody>
            </div>
            <div className={classes.flexOrder}>
              <ParagraphBody $colorName="--eerie-black" translation-key="common_vat">
                {t('common_vat', { percent: (configs?.vat || 0) * 100 })}
              </ParagraphBody>
              <ParagraphBody variant="tabular_nums" $colorName="--eerie-black">{price?.vatCost?.show}</ParagraphBody>
            </div>
            <Divider />
            <div className={classes.flexTotal}>
              <Heading5 $colorName="--eerie-black" translation-key="common_total">{t('common_total')}</Heading5>
              <Heading2 variant="tabular_nums" $colorName="--cimigo-green-dark-1">{price?.totalAmountCost?.show}</Heading2>
            </div>
            <Box display="flex" justifyContent="flex-end">
              <Heading6 variant="tabular_nums" $colorName="--cimigo-blue-dark-1" sx={{ textAlign: "right" }}>({price?.totalAmountCost?.equivalent})</Heading6>
            </Box>
            <div className={classes.chargedBy}>
              <ParagraphExtraSmall mr={1} $colorName="--gray-40" translation-key="payment_billing_sub_tab_payment_note">{t("payment_billing_sub_tab_payment_note")}</ParagraphExtraSmall>
              <TooltipCustom popperClass={classes.popperClass} translation-key="payment_billing_sub_tab_payment_note_tooltip" title={t("payment_billing_sub_tab_payment_note_tooltip")}>
                <InfoOutlined sx={{ fontSize: 16, color: "var(--gray-40)" }} />
              </TooltipCustom>
            </div>
          </Grid>
          <Button
            fullWidth
            type="submit"
            className={classes.btn}
            btnType={BtnType.Primary}
            disabled={!Number(watch("paymentMethodId"))}
          >
            <TextBtnSecondary translation-key="payment_billing_sub_tab_payment_summary_place_order">
              {t('payment_billing_sub_tab_payment_summary_place_order')}
            </TextBtnSecondary>
          </Button>
        </Grid>
        <Box className={classes.cancelPayment}>
          <TextBtnSmall $colorName="--gray-60" onClick={onShowConfirmCancel}>{t("common_cancel_payment")}</TextBtnSmall>
        </Box>
      </Grid>
      <Grid className={classes.flexTotalMobile}>
        <Grid>
          <Heading5 mb={1} $colorName="--eerie-black" translation-key="common_total">{t('common_total')}</Heading5>
          <Heading2 variant="tabular_nums" $colorName="--cimigo-green-dark-1">{price?.totalAmountCost?.show}</Heading2>
          <ParagraphExtraSmall variant="tabular_nums" $colorName="--cimigo-blue-dark-2" $fontWeight={800}>({price?.totalAmountCost?.equivalent})</ParagraphExtraSmall>
        </Grid>
        <Button
          type="submit"
          sx={{ whiteSpace: "nowrap" }}
          btnType={BtnType.Primary}
          disabled={!Number(watch("paymentMethodId"))}
        >
          <TextBtnSecondary translation-key="payment_billing_sub_tab_payment_summary_place_order">
            {t('payment_billing_sub_tab_payment_summary_place_order')}
          </TextBtnSecondary>
        </Button>
      </Grid>
      <PopupConfirmInvoiceInfo
        isOpen={!!showSkipInfor}
        onClose={onUpdateInfo}
        onYes={onSkipUpdateInfo}
      />
      <PopupConfirmCancelOrder
        isOpen={isConfirmCancel}
        onClose={onCloseConfirmCancel}
        onConfirm={onCancelPayment}
      />
    </Grid>
  )
})

export default PaymentPage;
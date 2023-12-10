import { memo, useEffect, useMemo, useState } from "react";
import { Box, Collapse, Divider, FormControlLabel, Grid, IconButton, Radio, RadioGroup, useMediaQuery, useTheme } from "@mui/material";
import classes from "./styles.module.scss";
import images from "config/images";
import InputSelect from "components/common/inputs/InputSelect";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { EPaymentMethod, OptionItem } from "models/general";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import CountryService from "services/country";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import UserService from "services/user";
import { getPaymentSchedulesRequest } from "redux/reducers/Project/actionTypes";
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
import Heading3 from "components/common/text/Heading3";
import Heading4 from "components/common/text/Heading4";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import { AttachmentService } from "services/attachment";
import FileSaver from "file-saver";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import ButtonClose from "components/common/buttons/ButtonClose";
import PopupPayment from "../components/PopupPayment";
import { PaymentSchedule } from "models/payment_schedule";
import { usePrice } from "helpers/price";
import { PaymentInfo } from "models/payment_info";
import { PaymentService } from "services/payment";
import { Payment } from "models/payment";
import useDateTime from "hooks/useDateTime"

interface DataForm {
  paymentMethodId: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  saveForLater: boolean;
  fullName: string;
  companyName: string;
  title: string;
  email: string;
  phone: string;
  countryId: OptionItem;
  companyAddress: string;
  taxCode: string;
}
interface Props {
  isOpen: boolean;
  paymentSchedule: PaymentSchedule;
  onClose: () => void;
  onOpenModal?: (item: PaymentSchedule) => void;
}

const PopupPayNow = memo((props: Props) => {
  const { isOpen, paymentSchedule, onClose, onOpenModal } = props;
  const { getCostCurrency } = usePrice();
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => {
    return yup.object().shape({
      paymentMethodId: yup.number(),
      contactName: yup.string().when("paymentMethodId", {
        is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
        then: yup.string().required(t("field_contact_name_vali_required")),
        otherwise: yup.string(),
      }),
      contactEmail: yup
        .string()
        .email()
        .when("paymentMethodId", {
          is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
          then: yup.string().email(t("field_contact_email_vali_email")).required(t("field_contact_email_vali_required")),
          otherwise: yup.string().email(t("field_contact_email_vali_email")),
        }),
      contactPhone: yup.string().when("paymentMethodId", {
        is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
        then: yup
          .string()
          .matches(VALIDATION.phone, { message: t("field_contact_phone_number_vali_phone"), excludeEmptyString: true })
          .required(t("field_contact_phone_vali_required")),
        otherwise: yup.string().matches(VALIDATION.phone, { message: t("field_contact_phone_number_vali_phone"), excludeEmptyString: true }),
      }),

      saveForLater: yup.bool(),
      fullName: yup.string().when("saveForLater", {
        is: (val: boolean) => val,
        then: yup.string().required(t("field_full_name_vali_required")),
        otherwise: yup.string(),
      }),
      companyName: yup.string().when("saveForLater", {
        is: (val: boolean) => val,
        then: yup.string().required(t("field_company_vali_required")),
        otherwise: yup.string(),
      }),
      title: yup.string().when("saveForLater", {
        is: (val: boolean) => val,
        then: yup.string().required(t("field_your_title_vali_required")),
        otherwise: yup.string(),
      }),
      email: yup.string().when("saveForLater", {
        is: (val: boolean) => val,
        then: yup.string().email(t("field_email_vali_email")).required(t("field_email_vali_required")),
        otherwise: yup.string().email(t("field_email_vali_email")),
      }),
      phone: yup.string().when("saveForLater", {
        is: (val: boolean) => val,
        then: yup
          .string()
          .matches(VALIDATION.phone, { message: t("field_phone_number_vali_phone"), excludeEmptyString: true })
          .required(t("field_phone_number_vali_required")),
        otherwise: yup.string().matches(VALIDATION.phone, { message: t("field_phone_number_vali_phone"), excludeEmptyString: true }),
      }),
      countryId: yup.object().when("saveForLater", {
        is: (val: boolean) => val,
        then: yup.object().required(t("field_country_vali_required")),
        otherwise: yup.object(),
      }),
      companyAddress: yup.string().when("saveForLater", {
        is: (val: boolean) => val,
        then: yup.string().required(t("field_company_address_vali_required")),
        otherwise: yup.string(),
      }),
      taxCode: yup.string(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    clearErrors,
    reset,
    setValue,
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      saveForLater: true,
      paymentMethodId: null,
    },
  });

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();
  const { project } = useSelector((state: ReducerType) => state.project);
  const { user, configs } = useSelector((state: ReducerType) => state.user);

  const [countries, setCountries] = useState<OptionItem[]>([]);
  const [showSkipInfor, setShowSkipInfor] = useState<DataForm>();
  const [isExpandedInfo, setIsExpandedInfo] = useState<boolean>(true);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      await Promise.all([
        CountryService.getCountries({ take: 9999 }),
        UserService.getPaymentInfo()
      ]).then((res) => {
        setCountries(res[0].data);
        setPaymentInfo(res[1]);
      });
      dispatch(setLoading(false));
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
   if (!paymentInfo && !user) return;
   let countryId: OptionItem = undefined;
   if (user?.country) {
     countryId = { id: user.country.id, name: user.country.name };
   }
   if (paymentInfo?.country) {
     countryId = { id: paymentInfo.country.id, name: paymentInfo.country.name };
   }
    reset({
      paymentMethodId: null,
      contactName: user?.fullName || "",
      contactEmail: user?.email || "",
      contactPhone: user?.phone || "",
      saveForLater: true,
      fullName: paymentInfo?.fullName || user?.fullName || "",
      companyName: paymentInfo?.companyName || user?.company || "",
      title: paymentInfo?.title || user?.title || "",
      email: paymentInfo?.email || user?.email || "",
      phone: paymentInfo?.phone || user?.phone || "",
      countryId: countryId,
      companyAddress: paymentInfo?.companyAddress || "",
      taxCode: paymentInfo?.taxCode || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentInfo, user]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      switch (name) {
        case "paymentMethodId":
          if (value.paymentMethodId !== EPaymentMethod.MAKE_AN_ORDER) {
            clearErrors(["contactEmail", "contactName", "contactPhone"]);
          }
          break;
        case "saveForLater":
          if (!value.saveForLater) {
            clearErrors(["fullName", "companyName", "email", "phone", "countryId", "companyAddress", "taxCode"]);
          }
          break;
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const onCheckout = (data: DataForm) => {
    dispatch(setLoading(true));
    PaymentService.checkoutPaymentSchedule({
      paymentScheduleId: paymentSchedule.id,
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
      returnUrl: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePayPaymentSchedule}?projectId=${project.id}&paymentScheduleId=${paymentSchedule.id}`,
      againLink: `${process.env.REACT_APP_BASE_URL}${routes.callback.project.onePayPaymentScheduleAgainLink.replace(":id", `${project.id}`)}`,
    })
      .then((res: { payment: Payment; checkoutUrl: string }) => {
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          dispatch(getPaymentSchedulesRequest(project.id));
          onOpenModal({
            ...paymentSchedule,
            payments: [{...res.payment}]
          });
        }
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onConfirm = (data: DataForm) => {
    if (!project) return;
    onCheckout(data)
  };

  const onSkipUpdateInfo = () => {
    if (!showSkipInfor) return;
    onCheckout(showSkipInfor);
    setShowSkipInfor(null);
  };

  const onUpdateInfo = () => {
    setShowSkipInfor(null);
    scrollToElement("payment_invoice_and_contract_info");
  };

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerHeight = document.getElementById("header")?.offsetHeight || 0;
    window.scrollTo({ behavior: "smooth", top: el.offsetTop - headerHeight - 10 });
  };

  const onDownloadContract = () => {
    if (!configs.viewContract) return;
    dispatch(setLoading(true));
    AttachmentService.getDetail(configs.viewContract)
      .then((attachment) => {
        AttachmentService.download(configs.viewContract)
          .then((res) => {
            FileSaver.saveAs(res.data, attachment.fileName);
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)));
      })
      .catch((e) => {
        dispatch(setLoading(false));
        dispatch(setErrorMess(e));
      });
  };

  const { formatFullDate, formatMonthYear } = useDateTime()
  
  return (
    <PopupPayment scroll="paper" open={isOpen} onClose={onClose} $maxWithUnset={true}>
      <DialogContentConfirm dividers $padding="0">
        <Grid component={"form"} classes={{ root: classes.root }} onSubmit={handleSubmit(onConfirm)} noValidate autoComplete="off">
          <Divider className={classes.divider1} />
          <Grid classes={{ root: classes.left }}>
            <ButtonClose $backgroundColor="--eerie-black-5" className={classes.btnCloseMobile} $colorName="--eerie-black-40" onClick={onClose} />
            <Heading3 $colorName="--cimigo-blue" translation-key="brand_track_paynow_popup_payment_title">
              {t("brand_track_paynow_popup_payment_title", {
                start: formatMonthYear(paymentSchedule.start),
                end: formatMonthYear(paymentSchedule.end),
              })}
            </Heading3>
            <Box display={"flex"} alignItems="center">
              <ParagraphSmall $colorName="--gray-80">{paymentSchedule.project.name}</ParagraphSmall>
              &nbsp;
              <ParagraphSmall $colorName="--gray-80" translation-key="common_id">
                - {t("common_id", { id: paymentSchedule.projectId })}
              </ParagraphSmall>
            </Box>
            <Heading5 mt={3} mb={2} $colorName="--cimigo-blue" translation-key="payment_billing_sub_tab_payment_method">
              {t("payment_billing_sub_tab_payment_method")}:
            </Heading5>
            <Controller
              name="paymentMethodId"
              control={control}
              render={({ field }) => (
                <RadioGroup name={field.name} value={field.value} ref={field.ref} onBlur={field.onBlur} classes={{ root: classes.radioGroup }}>
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
                        <img src={images.icBank} alt="" />
                        {t("payment_billing_sub_tab_payment_method_bank_transfer")}
                      </ParagraphBody>
                      <ParagraphSmall
                        $colorName="--gray-80"
                        className={classes.titleSub}
                        translation-key="brand_track_paynow_popup_sub_tab_payment_method_bank_transfer_sub"
                      >
                        {t("brand_track_paynow_popup_sub_tab_payment_method_bank_transfer_sub")}
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
                        <img src={images.icInternetBanking} alt="" />
                        {t("payment_billing_sub_tab_payment_method_onepay")}
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
                        translation-key="brand_track_paynow_popup_sub_tab_payment_method_onepay_sub"
                      >
                        {t("brand_track_paynow_popup_sub_tab_payment_method_onepay_sub")}
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
                        <img src={images.icOrder} alt="" />
                        {t("payment_billing_sub_tab_payment_method_make_an_order")}
                      </ParagraphBody>
                      <ParagraphSmall
                        $colorName="--gray-80"
                        className={classes.titleSub}
                        translation-key="brand_track_paynow_popup_sub_tab_payment_method_make_an_order_sub"
                      >
                        {t("brand_track_paynow_popup_sub_tab_payment_method_make_an_order_sub")}
                        {Number(watch("paymentMethodId")) === EPaymentMethod.MAKE_AN_ORDER && (
                          <ParagraphSmall
                            $colorName="--gray-80"
                            className={classes.titleSub}
                            translation-key="brand_track_paynow_popup_sub_tab_payment_method_make_an_order_sub_2"
                          >
                            {t("brand_track_paynow_popup_sub_tab_payment_method_make_an_order_sub_2")}
                          </ParagraphSmall>
                        )}
                      </ParagraphSmall>
                      {Number(watch("paymentMethodId")) === EPaymentMethod.MAKE_AN_ORDER && (
                        <Box mb={4} mt={2} sx={{ maxWidth: "325px" }}>
                          <InputTextField
                            className={classes.customTextField}
                            title={t("field_contact_name")}
                            translation-key="field_contact_name"
                            name="contactName"
                            placeholder={t("field_contact_name_placeholder")}
                            translation-key-placeholder="field_contact_name_placeholder"
                            inputRef={register("contactName")}
                            errorMessage={errors.contactName?.message}
                            rootProps={{ sx: { mb: 1 } }}
                          />
                          <InputTextField
                            className={classes.customTextField}
                            title={t("field_contact_email")}
                            translation-key="field_contact_email"
                            name="contactEmail"
                            placeholder={t("field_contact_email_placeholder")}
                            translation-key-placeholder="field_contact_email_placeholder"
                            inputRef={register("contactEmail")}
                            errorMessage={errors.contactEmail?.message}
                            rootProps={{ sx: { mb: 1 } }}
                          />
                          <InputTextField
                            className={classes.customTextField}
                            title={t("field_contact_phone")}
                            translation-key="field_contact_phone"
                            name="contactPhone"
                            placeholder={t("field_contact_phone_placeholder")}
                            translation-key-placeholder="field_contact_phone_placeholder"
                            inputRef={register("contactPhone")}
                            errorMessage={errors.contactPhone?.message}
                          />
                        </Box>
                      )}
                    </Grid>
                  </Box>
                  <Divider />
                </RadioGroup>
              )}
            />
            <Box
              className={classes.paddingMobile}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ cursor: isMobile && "pointer" }}
              onClick={() => isMobile && setIsExpandedInfo((pre) => !pre)}
            >
              <Heading5
                id="payment_invoice_and_contract_info"
                $colorName="--cimigo-blue"
                className={classes.titleInfo}
                translation-key="payment_billing_sub_tab_payment_invoice_and_contract_info"
              >
                {t("payment_billing_sub_tab_payment_invoice_and_contract_info")}{" "}
              </Heading5>
              <IconButton sx={{ transform: isExpandedInfo ? "rotate(180deg)" : "unset" }} className={classes.isMobile}>
                <ExpandMore sx={{ fontSize: 24, color: "var(--eerie-black-40)" }} />
              </IconButton>
            </Box>
            <Collapse in={isExpandedInfo || !isMobile} timeout="auto" unmountOnExit>
              <Grid className={classes.informationBox} container rowSpacing={1} columnSpacing={3}>
                <Grid item xs={12} sm={6}>
                  <InputTextField
                    className={classes.customTextField}
                    title={t("field_full_name")}
                    translation-key="field_full_name"
                    placeholder={t("field_full_name_placeholder")}
                    translation-key-placeholder="field_full_name_placeholder"
                    name="fullName"
                    inputRef={register("fullName")}
                    errorMessage={errors.fullName?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputTextField
                    className={classes.customTextField}
                    title={t("field_company")}
                    translation-key="field_company"
                    placeholder={t("field_company_placeholder")}
                    translation-key-placeholder="field_company_placeholder"
                    name="companyName"
                    inputRef={register("companyName")}
                    errorMessage={errors.companyName?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputTextField
                    className={classes.customTextField}
                    title={t("field_your_title")}
                    translation-key="field_your_title"
                    placeholder={t("field_your_title_placeholder")}
                    translation-key-placeholder="field_your_title_placeholder"
                    name="title"
                    inputRef={register("title")}
                    errorMessage={errors.title?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputTextField
                    className={classes.customTextField}
                    title={t("field_email")}
                    translation-key="field_email"
                    placeholder={t("field_email_placeholder")}
                    translation-key-placeholder="field_email_placeholder"
                    name="email"
                    inputRef={register("email")}
                    errorMessage={errors.email?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputTextField
                    className={classes.customTextField}
                    title={t("field_phone_number")}
                    translation-key="field_phone_number"
                    placeholder={t("field_phone_number_placeholder")}
                    translation-key-placeholder="field_phone_number_placeholder"
                    name="phone"
                    inputRef={register("phone")}
                    errorMessage={errors.phone?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputSelect
                    fullWidth
                    title={t("field_country")}
                    name="countryId"
                    control={control}
                    errorMessage={(errors.countryId as any)?.message}
                    selectProps={{
                      options: countries,
                      placeholder: t("field_country_placeholder"),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputTextField
                    className={classes.customTextField}
                    title={t("field_company_address")}
                    translation-key="field_company_address"
                    placeholder={t("field_company_address_placeholder")}
                    translation-key-placeholder="field_company_address_placeholder"
                    name="companyAddress"
                    inputRef={register("companyAddress")}
                    errorMessage={errors.companyAddress?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputTextField
                    className={classes.customTextField}
                    optional
                    title={t("field_tax_code_for_invoice")}
                    translation-key="field_tax_code_for_invoice"
                    placeholder={t("field_tax_code_for_invoice_placeholder")}
                    translation-key-placeholder="field_tax_code_for_invoice_placeholder"
                    name="taxCode"
                    inputRef={register("taxCode")}
                    errorMessage={errors.taxCode?.message}
                  />
                </Grid>
                <Grid item xs={12} className={classes.tips}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="saveForLater"
                        control={control}
                        render={({ field }) => <InputCheckbox checked={field.value} onChange={field.onChange} />}
                      />
                    }
                    translation-key="payment_billing_sub_tab_payment_save_for_later"
                    label={<>{t("payment_billing_sub_tab_payment_save_for_later")}</>}
                  />
                  <TooltipCustom
                    popperClass={classes.popperClass}
                    title={t("payment_billing_sub_tab_payment_save_for_later_tip")}
                    translation-key="payment_billing_sub_tab_payment_save_for_later_tip"
                  >
                    <InfoOutlined sx={{ ml: 0.5, fontSize: 16, color: "var(--eerie-black-40)" }} />
                  </TooltipCustom>
                </Grid>
                {!!configs?.viewContract && (
                  <Grid item xs={12}>
                    <ParagraphSmall mt={2} $colorName="--eerie-black-65" translation-key="payment_invoice_and_contract_info_bottom_1">
                      {t("payment_invoice_and_contract_info_bottom_1")}{" "}
                      <span
                        onClick={onDownloadContract}
                        className="underline cursor-pointer"
                        translation-key="payment_invoice_and_contract_info_bottom_2"
                      >
                        {t("payment_invoice_and_contract_info_bottom_2")}
                      </span>
                    </ParagraphSmall>
                  </Grid>
                )}
              </Grid>
            </Collapse>
            <Divider className={classes.divider1} />
          </Grid>
          <Grid classes={{ root: classes.right }}>
            <ButtonClose $backgroundColor="--eerie-black-5" className={classes.btnClose} $colorName="--eerie-black-40" onClick={onClose} />
            <Grid classes={{ root: classes.sumaryBox }}>
              <Grid classes={{ root: classes.bodyOrder }}>
                <Heading4 className={classes.sumaryTitle} $colorName="--cimigo-blue" translation-key="payment_billing_sub_tab_payment_summary">
                  {t("payment_billing_sub_tab_payment_summary")}
                </Heading4>
                <Heading5 mb={-1} translate-key="brand_track_paynow_popup_items_title">
                  {t("brand_track_paynow_popup_items_title")}
                </Heading5>
                <Divider />
                <div className={classes.flexOrder}>
                  <ParagraphBody $colorName="--eerie-black" $fontWeight={500} translation-key="brand_track_paynow_popup_project_name">
                    {t("brand_track_paynow_popup_project_name", {
                      time: `${paymentSchedule.solutionConfig.paymentMonthSchedule} ${t("common_month", {
                        s: paymentSchedule.solutionConfig.paymentMonthSchedule > 1 ? t("common_s") : "",
                      })}`,
                    })}
                  </ParagraphBody>
                  <ParagraphBody variant="tabular_nums" $colorName="--eerie-black" $fontWeight={500}>
                    {getCostCurrency(paymentSchedule.amount)?.show}
                  </ParagraphBody>
                </div>
                <ParagraphExtraSmall $colorName="--eerie-black">
                  {formatMonthYear(paymentSchedule.start)} - {formatMonthYear(paymentSchedule.end)}
                </ParagraphExtraSmall>
                <ParagraphExtraSmall $colorName="--eerie-black" translation-key="brand_track_paynow_popup_project_id">
                  {t("brand_track_paynow_popup_project_id", { id: paymentSchedule.projectId })}
                </ParagraphExtraSmall>
                <Divider />
                <div className={classes.flexOrder}>
                  <ParagraphBody $colorName="--eerie-black" translation-key="common_sub_total">
                    {t("common_sub_total")}
                  </ParagraphBody>
                  <ParagraphBody variant="tabular_nums" $colorName="--eerie-black" $fontWeight={500}>
                    {getCostCurrency(paymentSchedule.amount)?.show}
                  </ParagraphBody>
                </div>
                <div className={classes.flexOrder}>
                  <ParagraphBody $colorName="--eerie-black" translation-key="common_vat">
                    {t("common_vat", { percent: (paymentSchedule.systemConfig?.vat || 0) * 100 })}
                  </ParagraphBody>
                  <ParagraphBody variant="tabular_nums" $colorName="--eerie-black" $fontWeight={500}>
                    {getCostCurrency(paymentSchedule.vat)?.show}
                  </ParagraphBody>
                </div>
                <Divider />
                <div className={classes.flexTotal}>
                  <Heading4 $colorName="--eerie-black" $fontWeight={500} translation-key="common_total">
                    {t("common_total")}
                  </Heading4>
                  <Heading4 variant="tabular_nums" $colorName="--eerie-black" $fontWeight={500}>
                    {getCostCurrency(paymentSchedule.totalAmount)?.show}
                  </Heading4>
                </div>
              </Grid>
              <Button fullWidth type="submit" className={classes.btn} btnType={BtnType.Primary} disabled={!Number(watch("paymentMethodId"))}>
                <TextBtnSecondary translation-key="brand_track_paynow_popup_make_payment">
                  {t("brand_track_paynow_popup_make_payment")}
                </TextBtnSecondary>
              </Button>
            </Grid>
          </Grid>
          <Grid className={classes.flexTotalMobile}>
            <Grid>
              <Heading3 mb={1} $colorName="--eerie-black" $fontWeight={500} translation-key="common_total">
                {t("common_total")}
              </Heading3>
              <Heading3 variant="tabular_nums" $colorName="--eerie-black" $fontWeight={500}>
                {getCostCurrency(paymentSchedule.totalAmount)?.show}
              </Heading3>
            </Grid>
            <Button type="submit" sx={{ whiteSpace: "nowrap" }} btnType={BtnType.Primary} disabled={!Number(watch("paymentMethodId"))}>
              <TextBtnSecondary translation-key="brand_track_paynow_popup_make_payment">
                {t("brand_track_paynow_popup_make_payment")}
              </TextBtnSecondary>
            </Button>
          </Grid>
          <PopupConfirmInvoiceInfo isOpen={!!showSkipInfor} onClose={onUpdateInfo} onYes={onSkipUpdateInfo} />
        </Grid>
      </DialogContentConfirm>
    </PopupPayment>
  );
});
export default PopupPayNow;

import * as yup from "yup";
import images from "config/images";
import { memo, useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { Box, Divider, Grid, Radio, RadioGroup } from "@mui/material";
import { EPaymentMethod } from "models/general";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InfoOutlined } from "@mui/icons-material";
import TooltipCustom from "components/Tooltip";
import { VALIDATION } from "config/constans";
import { ChangePaymentMethodFormData, Payment } from "models/payment";
import { User } from "models/user";
import { ConfigData } from "models/config";
import { useTranslation } from "react-i18next";
import { Project } from "models/project";
import Heading1 from "components/common/text/Heading1";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading5 from "components/common/text/Heading5";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import InputTextfield from "components/common/inputs/InputTextfield";
import Heading4 from "components/common/text/Heading4";
import Heading2 from "components/common/text/Heading2";
import Heading6 from "components/common/text/Heading6";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import PopupConfirmCancelOrder from "pages/SurveyNew/components/PopupConfirmCancelOrder";
import { usePrice } from "helpers/price";
import { ESOLUTION_TYPE } from "models/solution";

interface Props {
  project: Project;
  user: User;
  configs: ConfigData;
  payment: Payment;
  onConfirm: (data: ChangePaymentMethodFormData) => void;
  onCancelPayment: () => void;
}

const ChangePaymentMethod = memo(
  ({ project, user, configs, payment, onConfirm, onCancelPayment }: Props) => {
    const { t, i18n } = useTranslation();

    const { getCostCurrency } = usePrice()

    const [isConfirmCancel, setIsConfirmCancel] = useState<boolean>(false);

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
            then: yup
              .string()
              .email(t("field_contact_email_vali_email"))
              .required(t("field_contact_email_vali_required")),
            otherwise: yup.string().email(t("field_contact_email_vali_email")),
          }),
        contactPhone: yup.string().when("paymentMethodId", {
          is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
          then: yup
            .string()
            .matches(VALIDATION.phone, {
              message: t("field_contact_phone_number_vali_phone"),
              excludeEmptyString: true,
            })
            .required(t("field_contact_phone_vali_required")),
          otherwise: yup.string().matches(VALIDATION.phone, {
            message: t("field_contact_phone_number_vali_phone"),
            excludeEmptyString: true,
          }),
        }),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
      watch,
      reset,
      setValue,
    } = useForm<ChangePaymentMethodFormData>({
      resolver: yupResolver(schema),
      mode: "onChange",
      defaultValues: {
        paymentMethodId: null,
      },
    });

    useEffect(() => {
      if (!user) return;
      reset({
        paymentMethodId: null,
        contactName: user?.fullName || "",
        contactEmail: user?.email || "",
        contactPhone: user?.phone || "",
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const onShowConfirmCancel = () => {
      setIsConfirmCancel(true);
    };

    const onCloseConfirmCancel = () => {
      setIsConfirmCancel(false);
    };
    
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
      <Grid>
        <Heading1
          $colorName="--cimigo-blue"
          className={classes.changePaymentMethodTitle}
          translation-key="payment_billing_change_method_title"
        >
          {t("payment_billing_change_method_title")}
        </Heading1>
        <ParagraphBody
          $colorName="--eerie-black-65"
          mb={6}
          textAlign={"center"}
          translation-key="payment_billing_change_method_subTitle"
        >
          {t("payment_billing_change_method_subTitle")}
        </ParagraphBody>
        <Grid
          component={"form"}
          className={classes.root1}
          onSubmit={handleSubmit(onConfirm)}
          noValidate
          autoComplete="off"
        >
          <Divider className={classes.divider1} />
          <Grid classes={{ root: classes.left }}>
            <Heading5
              className={classes.titleLeft}
              mb={1.3}
              $colorName="--cimigo-blue"
              translation-key="payment_billing_sub_tab_payment_method"
            >
              {t("payment_billing_sub_tab_payment_method")}:
            </Heading5>
            <Controller
              name="paymentMethodId"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  classes={{ root: classes.radioGroup }}
                >
                  <Box className={classes.lable}>
                    <Radio
                      checked={field.value === EPaymentMethod.BANK_TRANSFER}
                      onChange={() =>
                        setValue(
                          "paymentMethodId",
                          EPaymentMethod.BANK_TRANSFER
                        )
                      }
                      classes={{
                        root: classes.rootRadio,
                        checked: classes.checkRadio,
                      }}
                    />
                    <Grid classes={{ root: classes.order }}>
                      <ParagraphBody
                        $colorName="--cimigo-blue"
                        className={classes.title}
                        onClick={() =>
                          setValue(
                            "paymentMethodId",
                            EPaymentMethod.BANK_TRANSFER
                          )
                        }
                        translation-key="payment_billing_sub_tab_payment_method_bank_transfer"
                      >
                        <img src={images.icBank} alt="" />
                        {t(
                          "payment_billing_sub_tab_payment_method_bank_transfer"
                        )}
                      </ParagraphBody>
                      <ParagraphSmall
                        $colorName="--gray-80"
                        className={classes.titleSub}
                        translation-key="payment_billing_sub_tab_payment_method_bank_transfer_sub"
                      >
                        {t(
                          "payment_billing_sub_tab_payment_method_bank_transfer_sub"
                        )}
                      </ParagraphSmall>
                    </Grid>
                  </Box>
                  <Box className={classes.lable} my={2}>
                    <Radio
                      checked={field.value === EPaymentMethod.ONEPAY_GENERAL}
                      onChange={() =>
                        setValue(
                          "paymentMethodId",
                          EPaymentMethod.ONEPAY_GENERAL
                        )
                      }
                      classes={{
                        root: classes.rootRadio,
                        checked: classes.checkRadio,
                      }}
                    />
                    <Grid classes={{ root: classes.order }}>
                      <ParagraphBody
                        $colorName="--cimigo-blue"
                        className={classes.title}
                        onClick={() =>
                          setValue(
                            "paymentMethodId",
                            EPaymentMethod.ONEPAY_GENERAL
                          )
                        }
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
                        translation-key="payment_billing_sub_tab_payment_method_onepay_sub"
                      >
                        {t("payment_billing_sub_tab_payment_method_onepay_sub")}
                      </ParagraphSmall>
                    </Grid>
                  </Box>
                  <Box className={classes.lable}>
                    <Radio
                      checked={field.value === EPaymentMethod.MAKE_AN_ORDER}
                      onChange={() =>
                        setValue(
                          "paymentMethodId",
                          EPaymentMethod.MAKE_AN_ORDER
                        )
                      }
                      classes={{
                        root: classes.rootRadio,
                        checked: classes.checkRadio,
                      }}
                    />
                    <Grid classes={{ root: classes.order }}>
                      <ParagraphBody
                        $colorName="--cimigo-blue"
                        className={classes.title}
                        translation-key="payment_billing_sub_tab_payment_method_make_an_order"
                        onClick={() =>
                          setValue(
                            "paymentMethodId",
                            EPaymentMethod.MAKE_AN_ORDER
                          )
                        }
                      >
                        <img src={images.icOrder} alt="" />
                        {t(
                          "payment_billing_sub_tab_payment_method_make_an_order"
                        )}
                      </ParagraphBody>
                      <ParagraphSmall
                        $colorName="--gray-80"
                        className={classes.titleSub}
                        sx={{ mb: "16px !important" }}
                        translation-key="payment_billing_sub_tab_payment_method_make_an_order_sub"
                      >
                        {t(
                          "payment_billing_sub_tab_payment_method_make_an_order_sub"
                        )}
                      </ParagraphSmall>
                      {Number(watch("paymentMethodId")) ===
                        EPaymentMethod.MAKE_AN_ORDER && (
                          <Box mb={4} sx={{ maxWidth: "325px" }}>
                            <InputTextfield
                              title={t("field_contact_name")}
                              translation-key="field_contact_name"
                              name="contactName"
                              placeholder={t("field_contact_name_placeholder")}
                              translation-key-placeholder="field_contact_name_placeholder"
                              inputRef={register("contactName")}
                              errorMessage={errors.contactName?.message}
                              rootProps={{ sx: { mb: 1 } }}
                            />
                            <InputTextfield
                              title={t("field_contact_email")}
                              translation-key="field_contact_email"
                              name="contactEmail"
                              placeholder={t("field_contact_email_placeholder")}
                              translation-key-placeholder="field_contact_email_placeholder"
                              inputRef={register("contactEmail")}
                              errorMessage={errors.contactEmail?.message}
                              rootProps={{ sx: { mb: 1 } }}
                            />
                            <InputTextfield
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
                </RadioGroup>
              )}
            />
            <Divider className={classes.divider1} />
          </Grid>
          <Grid classes={{ root: classes.right }}>
            <Grid classes={{ root: classes.sumaryBox }}>
              <Grid classes={{ root: classes.bodyOrder }}>
                <Heading4
                  className={classes.titleRigth}
                  $colorName="--cimigo-blue"
                  translation-key="payment_billing_sub_tab_payment_summary"
                >
                  {t("payment_billing_sub_tab_payment_summary")}
                </Heading4>
                <div className={classes.flexOrder}>
                  <ParagraphBody
                    $colorName="--eerie-black"
                    translation-key="common_sample_size"
                  >
                    {t("common_sample_size")} {`(${payment?.sampleSize || 0})`}
                  </ParagraphBody>
                  <ParagraphBody variant="tabular_nums" $colorName="--eerie-black">
                    {getCostCurrency(payment?.sampleSizeCost, payment?.currency)?.show}
                  </ParagraphBody>
                </div>
                {payment?.customQuestions?.length > 0 && (
                  <div className={classes.flexOrder}>
                    <ParagraphBody
                      $colorName="--eerie-black"
                      translation-key="common_custom_question"
                    >
                      {t("common_custom_question")}{" "}
                      {`(${project?.customQuestions?.length || 0})`}
                    </ParagraphBody>
                    <ParagraphBody variant="tabular_nums" $colorName="--eerie-black">
                      {getCostCurrency(payment?.customQuestionCost, payment?.currency)?.show}
                    </ParagraphBody>
                  </div>
                )}
                {!!project?.enableEyeTracking && (
                  <div className={classes.flexOrder}>
                      {renderEmotion()}
                    <ParagraphBody variant="tabular_nums" $colorName="--eerie-black">
                      {getCostCurrency(payment?.eyeTrackingSampleSizeCost, payment?.currency)?.show}
                    </ParagraphBody>
                  </div>
                )}
                <Divider />
                <div className={classes.flexOrder}>
                  <ParagraphBody
                    $colorName="--eerie-black"
                    translation-key="common_vat"
                  >
                    {t("common_sub_total")}
                  </ParagraphBody>
                  <ParagraphBody variant="tabular_nums" $colorName="--eerie-black">
                    {getCostCurrency(payment?.amount, payment?.currency)?.show}
                  </ParagraphBody>
                </div>
                <div className={classes.flexOrder}>
                  <ParagraphBody
                    $colorName="--eerie-black"
                    translation-key="common_vat"
                  >
                    {t("common_vat", { percent: (payment?.vatRate || 0) * 100 })}
                  </ParagraphBody>
                  <ParagraphBody variant="tabular_nums" $colorName="--eerie-black">
                    {getCostCurrency(payment?.vat, payment?.currency)?.show}
                  </ParagraphBody>
                </div>
                <Divider />
                <div className={classes.flexTotal}>
                  <Heading5
                    $colorName="--eerie-black"
                    translation-key="common_total"
                  >
                    {t("common_total")}
                  </Heading5>
                  <Heading2 variant="tabular_nums" $colorName="--cimigo-green-dark-1">
                    {getCostCurrency(payment?.totalAmount, payment?.currency)?.show}
                  </Heading2>
                </div>
                <Box display="flex" justifyContent="flex-end">
                  <Heading6
                    variant="tabular_nums"
                    $colorName="--cimigo-blue-dark-1"
                    sx={{ textAlign: "right" }}
                  >
                    ({getCostCurrency(payment?.totalAmount, payment?.currency)?.equivalent})
                  </Heading6>
                </Box>
                <div className={classes.chargedBy}>
                  <ParagraphExtraSmall
                    mr={1}
                    $colorName="--gray-40"
                    translation-key="payment_billing_sub_tab_payment_note"
                  >
                    {t("payment_billing_sub_tab_payment_note")}
                  </ParagraphExtraSmall>
                  <TooltipCustom
                    popperClass={classes.popperClass}
                    translation-key="payment_billing_sub_tab_payment_note_tooltip"
                    title={t("payment_billing_sub_tab_payment_note_tooltip")}
                  >
                    <InfoOutlined
                      sx={{ fontSize: 16, color: "var(--gray-40)" }}
                    />
                  </TooltipCustom>
                </div>
              </Grid>
              <Button
                fullWidth
                type="submit"
                className={classes.btn}
                btnType={BtnType.Primary}
                disabled={!Number(watch("paymentMethodId"))}
                padding="11px"
              >
                <TextBtnSecondary translation-key="payment_billing_sub_tab_payment_summary_place_order">
                  {t("payment_billing_sub_tab_payment_summary_place_order")}
                </TextBtnSecondary>
              </Button>
            </Grid>
            <Box className={classes.cancelPayment}>
              <TextBtnSmall
                $colorName="--gray-60"
                onClick={onShowConfirmCancel}
              >
                {t("common_cancel_payment")}
              </TextBtnSmall>
            </Box>
          </Grid>
          <Grid className={classes.flexTotalMobile}>
            <Grid>
              <Heading5
                mb={1}
                $colorName="--eerie-black"
                translation-key="common_total"
              >
                {t("common_total")}
              </Heading5>
              <Heading2 $colorName="--cimigo-green-dark-1" variant="tabular_nums">
                {getCostCurrency(payment?.totalAmount, payment?.currency)?.show}
              </Heading2>
              <ParagraphExtraSmall
                variant="tabular_nums"
                $colorName="--cimigo-blue-dark-2"
                $fontWeight={800}
              >
                ({getCostCurrency(payment?.totalAmount, payment?.currency)?.equivalent})
              </ParagraphExtraSmall>
            </Grid>
            <Button
              padding="11px"
              type="submit"
              sx={{ whiteSpace: "nowrap" }}
              btnType={BtnType.Primary}
              disabled={!Number(watch("paymentMethodId"))}
            >
              <TextBtnSecondary translation-key="payment_billing_sub_tab_payment_summary_place_order">
                {t("payment_billing_sub_tab_payment_summary_place_order")}
              </TextBtnSecondary>
            </Button>
          </Grid>
        </Grid>
        <PopupConfirmCancelOrder
          isOpen={isConfirmCancel}
          onClose={onCloseConfirmCancel}
          onConfirm={onCancelPayment}
        />
      </Grid>
    );
  }
);

export default ChangePaymentMethod;

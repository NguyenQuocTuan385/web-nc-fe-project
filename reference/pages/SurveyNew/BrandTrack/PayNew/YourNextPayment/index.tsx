import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Heading4 from "components/common/text/Heading4";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import classes from "./styles.module.scss";
import Dolar from "components/icons/IconDolar";
import Heading3 from "components/common/text/Heading3";
import ParagraphBody from "components/common/text/ParagraphBody";
import Button, { BtnType } from "components/common/buttons/Button";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import Footer from "components/Footer";
import { useEffect, useMemo, useState } from "react";
import Alert, { AlerType } from "../../../../../components/Alert";
import {
  EPaymentScheduleCancelType,
  PaymentSchedule,
  PaymentScheduleStatus,
} from "models/payment_schedule";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PopupConfirmCancelSubsription from "../components/PopupConfirmCancelSubsription";
import PaymentHistoryList from "../components/PaymentHistoryList";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import moment from "moment";
import { ReducerType } from "redux/reducers";
import { push } from "connected-react-router";
import { authYourNextPayment } from "../models";
import { usePrice } from "helpers/price";
import { setPaymentIsMakeAnOrderSuccessReducer, setPaymentScheduleResultReducer } from "redux/reducers/Payment/actionTypes";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { EPaymentMethod } from "models/general";
// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import PopupPayNow from "pages/SurveyNew/BrandTrack/components/PopupPayment/PopupPayNow";
import PopupBankTransfer from "pages/SurveyNew/BrandTrack/components/PopupPayment/PopupBankTransfer";
import PopupOnlinePayment from "pages/SurveyNew/BrandTrack/components/PopupPayment/PopupOnlinePayment";
import PopupSupportAgent from "pages/SurveyNew/BrandTrack/components/PopupPayment/PopupSupportAgent";
import { useTranslation } from "react-i18next";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { PaymentService } from "services/payment";
import FileSaver from "file-saver";
import { PaymentScheduleService } from "services/payment_schedule";
import { getPaymentSchedulesRequest } from "redux/reducers/Project/actionTypes";
import { ProjectService } from "services/project";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import { Content, LeftContent, PageRoot } from "pages/SurveyNew/components";
import useDateTime from "hooks/useDateTime"
import usePermissions from "hooks/usePermissions";

interface MakeAnOrderProp {
  projectId: number;
}

const sliderSettings = {
  0: {
    slidesPerView: 1,
    spaceBetween: 30,
  },
  1024: {
    slidesPerView: 2,
    spaceBetween: 30,
  },
};

const YourNextPayment = ({ projectId }: MakeAnOrderProp) => {
  const dispatch = useDispatch();
  
  const { t, i18n } = useTranslation();
  
  const { project } = useSelector((state: ReducerType) => state.project);
  const { isMakeAnOrder, paymentScheduleResult } = useSelector((state: ReducerType) => state.payment);

  const paymentSchedules = useMemo(() => project?.paymentSchedules || [], [project])

  const [isOpenPopupPaynow, setIsOpenPopupPaynow] = useState(false);
  const [isOpenPopupBankTransfer, setIsOpenPopupBankTransfer] = useState(false);
  const [isOpenPopupOnlinePayment, setIsOpenPopupOnlinePayment] =
    useState(false);
  const [isOpenPopupSuportAgent, setIsOpenPopupSupportAgent] = useState(false);
  const [paymentScheduleForPay, setDataPaymentSchedule] =
    useState<PaymentSchedule>();

  const [alertMakeAnOrderSuccess, setAlertMakeAnOrderSuccess] =
    useState<boolean>(false);

  const [alertPaymentReminder, setAlertPaymentReminder] =
    useState<PaymentSchedule>();

  const [onSubmitCancelSubsription, setOnSubmitCancelSubsription] =
    useState(false);

  const onCloseSubmitCancelSubsription = () => {
    setOnSubmitCancelSubsription(false);
  };

  const submitCancelSubsription = (reson: string) => {
    dispatch(setLoading(true));
    ProjectService.cancelPaymentScheduleSubscription({
      projectId: projectId,
      reason: reson
    })
      .then(() => {
        dispatch(getProjectRequest(projectId))
        onCloseSubmitCancelSubsription();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const cancelSubscription = () => {
    setOnSubmitCancelSubsription(true);
  };
  const goToPayNow = (item: PaymentSchedule) => {
    setDataPaymentSchedule(item);
    setIsOpenPopupPaynow(true);
  };
  const onCancelPayment = () => {
    dispatch(setLoading(true));
    PaymentScheduleService.cancelPaymentSchedule(paymentScheduleForPay.id)
      .then(() => {
        onClose();
        setIsOpenPopupPaynow(true);
        dispatch(getPaymentSchedulesRequest(project.id, (data) => {
          const newPaymentScheduleForPay = data.find((item) => item.id === paymentScheduleForPay.id);
          if (newPaymentScheduleForPay) setDataPaymentSchedule(newPaymentScheduleForPay);
        }));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };
  const onOpenModal = (item: PaymentSchedule) => {
    setIsOpenPopupPaynow(false);
    setDataPaymentSchedule(item)
    switch (item?.payments?.[0]?.paymentMethodId) {
      case EPaymentMethod.BANK_TRANSFER:
        setIsOpenPopupBankTransfer(true);
        break;
      case EPaymentMethod.ONEPAY_GENERAL:
        setIsOpenPopupOnlinePayment(true);
        break;
      case EPaymentMethod.MAKE_AN_ORDER:
        setIsOpenPopupSupportAgent(true);
        break;
      default:
        break;
    }
  };
  const onClose = () => {
    setIsOpenPopupPaynow(false);
    setIsOpenPopupBankTransfer(false);
    setIsOpenPopupOnlinePayment(false);
    setIsOpenPopupSupportAgent(false);
  };
  const { getCostCurrency } = usePrice();

  const onCloseMakeAnOrderSuccess = () => {
    setAlertMakeAnOrderSuccess(false);
  };
  
  const onCloseAlertPaymentScheduleResult = () => {
    dispatch(setPaymentScheduleResultReducer(null))
  };

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  };
  
  const handleDownloadInvoice = (paymentSchedule: PaymentSchedule) => {
    dispatch(setLoading(true));
    PaymentService.getPaymentScheduleInvoiceDemo(paymentSchedule.id)
      .then((res) => {
        FileSaver.saveAs(res.data, `invoice-${moment().format("MM-DD-YYYY-hh-mm-ss")}.pdf`);
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  }

  const setMainColorForPaymentSchedule = (paymentSchedule: PaymentSchedule, index: number) => {
    switch(paymentSchedule.status) {
      case PaymentScheduleStatus.IN_PROGRESS:
        return {
          header: "--gray-90",
          subHeader: "--gray-60"
        };
      case PaymentScheduleStatus.OVERDUE:
        return {
          header: "--gray-20",
          subHeader: "--gray-20"
        };
      case PaymentScheduleStatus.NOT_PAID:
        return {
          header: "--gray-90",
          subHeader: "--gray-60"
        };
      default:
        return {
          header: "--gray-20",
          subHeader: "--gray-20"
        };
    }
  }

  const { isAllowPayment } = usePermissions()

  useEffect(() => {
    authYourNextPayment(project, onRedirect, isAllowPayment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isAllowPayment]);

  useEffect(() => {
    if (paymentSchedules.length) {
      var paymentFirst = paymentSchedules[0];
      var now = moment().add(14, "d");
      if (
        moment(paymentFirst?.dueDate).isBefore(now) &&
        paymentFirst?.status === PaymentScheduleStatus.NOT_PAID
      ) {
        setAlertPaymentReminder(paymentFirst);
      } else {
        setAlertPaymentReminder(null);
      }
    }
  }, [paymentSchedules]);

  useEffect(() => {
    if (isMakeAnOrder) {
      setAlertMakeAnOrderSuccess(isMakeAnOrder);
      dispatch(setPaymentIsMakeAnOrderSuccessReducer(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMakeAnOrder]);

  const { formatFullDate, formatMonthYear } = useDateTime()

  return (
    <PageRoot>
      <LeftContent>
        <Content classes={{ root: classes.rootContent }}>
          <Grid classes={{ root: classes.root }}>
            {paymentScheduleResult && paymentScheduleResult?.isSuccess && (
              <Alert
                translation-key="brand_track_your_next_payment_title_alert_payment_success"
                title={t(
                  "brand_track_your_next_payment_title_alert_payment_success"
                )}
                onClose={onCloseAlertPaymentScheduleResult}
                content={
                  <ParagraphBody
                    $colorName={"--eerie-black"}
                    className={classes.contentAlert}
                    translation-key="brand_track_your_next_payment_content_alert_payment_success"
                    dangerouslySetInnerHTML={{
                      __html: t(
                        "brand_track_your_next_payment_content_alert_payment_success",
                        {
                          dateRange: `${formatMonthYear(paymentScheduleResult?.paymentSchedule?.start).toUpperCase()} - ${formatMonthYear(paymentScheduleResult?.paymentSchedule?.end).toUpperCase()}`,
                        }
                      ),
                    }}
                  ></ParagraphBody>
                }
                type={AlerType.Success}
              />
            )}
            {paymentScheduleResult && !paymentScheduleResult?.isSuccess && (
              <Alert
                translation-key="brand_track_your_next_payment_title_alert_payment_fail"
                title={t(
                  "brand_track_your_next_payment_title_alert_payment_fail"
                )}
                onClose={onCloseAlertPaymentScheduleResult}
                content={
                  <ParagraphBody
                    $colorName={"--eerie-black"}
                    className={classes.contentAlert}
                    translation-key="brand_track_your_next_payment_content_alert_payment_fail"
                    dangerouslySetInnerHTML={{
                      __html: t(
                        "brand_track_your_next_payment_content_alert_payment_fail",
                        {
                          dateRange: `${formatMonthYear(paymentScheduleResult?.paymentSchedule?.start).toUpperCase()} - ${formatMonthYear(paymentScheduleResult?.paymentSchedule?.end).toUpperCase()}`,
                        }
                      ),
                    }}
                  ></ParagraphBody>
                }
                type={AlerType.Error}
              />
            )}
            {alertMakeAnOrderSuccess && (
              <Alert
                title={t(
                  "brand_track_your_next_payment_title_alert_make_an_order_success"
                )}
                onClose={onCloseMakeAnOrderSuccess}
                content={
                  <ParagraphBody
                    $colorName={"--eerie-black"}
                    className={classes.contentAlert}
                    translation-key="brand_track_your_next_payment_content_alert_make_an_order_success_des"
                    dangerouslySetInnerHTML={{
                      __html: t(
                        "brand_track_your_next_payment_content_alert_make_an_order_success_des",
                        {
                          startPayment: formatMonthYear(project?.startPaymentSchedule),
                          dueDate: formatFullDate(paymentSchedules[0]?.dueDate),
                          scheduledMonths:
                            paymentSchedules[0]?.solutionConfig
                              ?.paymentMonthSchedule,
                        }
                      ),
                    }}
                  ></ParagraphBody>
                }
                type={AlerType.Success}
              />
            )}
            {alertPaymentReminder && !alertMakeAnOrderSuccess && (
              <Alert
                title={t("brand_track_your_next_payment_title_alert_warring")}
                content={
                  <Box>
                    <ParagraphBody
                      $colorName={"--eerie-black"}
                      className={classes.contentAlert}
                      translation-key="brand_track_your_next_payment_content_alert_warring_des_1"
                      dangerouslySetInnerHTML={{
                        __html: t(
                          "brand_track_your_next_payment_content_alert_warring_des_1",
                          {
                            date: formatFullDate(alertPaymentReminder?.dueDate),
                          }
                        ),
                      }}
                    ></ParagraphBody>
                    <ParagraphBody
                      $colorName={"--eerie-black"}
                      translation-key="brand_track_your_next_payment_content_alert_warring_des_2"
                    >
                      {t(
                        "brand_track_your_next_payment_content_alert_warring_des_2"
                      )}
                    </ParagraphBody>
                  </Box>
                }
                type={AlerType.Warning}
              />
            )}
            {project?.cancelPaymentScheduleType === EPaymentScheduleCancelType.USER_CANCEL && (
              <Alert
                translation-key="brand_track_your_next_payment_title_alert_subscription_canceled"
                title={t(
                  "brand_track_your_next_payment_title_alert_subscription_canceled"
                )}
                content={
                  <ParagraphBody
                    $colorName={"--eerie-black"}
                    translation-key="brand_track_your_next_payment_content_alert_subscription_canceled_des"
                  >
                    {t(
                      "brand_track_your_next_payment_content_alert_subscription_canceled_des"
                    )}
                  </ParagraphBody>
                }
                type={AlerType.Default}
              />
            )}
            {project?.cancelPaymentScheduleType === EPaymentScheduleCancelType.AUTO_CANCEL && (
              <Alert
                translation-key="brand_track_your_next_payment_title_alert_subscription_terminated"
                title={t(
                  "brand_track_your_next_payment_title_alert_subscription_terminated"
                )}
                content={
                  <ParagraphBody
                    $colorName={"--eerie-black"}
                    translation-key="brand_track_your_next_payment_content_alert_subscription_terminated_des"
                  >
                    {t(
                      "brand_track_your_next_payment_content_alert_subscription_terminated_des"
                    )}
                  </ParagraphBody>
                }
                type={AlerType.Default}
              />
            )}

            <Grid>
              {!project?.cancelPaymentScheduleType && (
                <Grid pt={4}>
                  <Grid className={classes.yourNextPaymentHeader}>
                    <Heading4
                      $fontWeight={"400"}
                      $colorName={"--eerie-black"}
                      translation-key="brand_track_your_next_payment_title"
                    >
                      {t("brand_track_your_next_payment_title")}
                    </Heading4>
                    <TextBtnSmall
                      className={classes.cancelSub}
                      $colorName={"--gray-80"}
                      pr={1}
                      onClick={cancelSubscription}
                      translation-key="brand_track_your_next_payment_title_cancel_subscription"
                    >
                      {t("brand_track_your_next_payment_title_cancel_subscription")}
                    </TextBtnSmall>
                  </Grid>
                  <Box className={classes.slidePayment} pt={3}>
                    <Grid className={classes.slidePaymentSwiper}>
                      <Box
                        className={clsx(classes.iconSlide, classes.iconSlideLeft)}
                      >
                        <KeyboardArrowLeftIcon />
                      </Box>
                      <Swiper
                        navigation={{
                          nextEl: `.${classes.iconSlideRight}`,
                          prevEl: `.${classes.iconSlideLeft}`,
                          disabledClass: classes.iconDisabled,
                        }}
                        modules={[Navigation]}
                        slidesPerView={2}
                        breakpoints={sliderSettings}
                        direction={"horizontal"}
                        spaceBetween={30}
                      >
                        {paymentSchedules?.map((item, index) => {
                          return (
                            <SwiperSlide key={item.id}>
                              <Box
                                className={clsx(
                                  classes.customSlide,
                                  {
                                    [classes.slideDefault]:
                                      item.status === PaymentScheduleStatus.NOT_PAID,
                                  },
                                  {
                                    [classes.slideProcessing]:
                                      item.status === PaymentScheduleStatus.IN_PROGRESS,
                                  },
                                  {
                                    [classes.slideDisabled]:
                                      item.status === PaymentScheduleStatus.OVERDUE || !!index,
                                  }
                                )}
                              >
                                <Box className={classes.contentSlideSwiper}>
                                  <Grid className={classes.contentLeftSwiper}>
                                    <Box sx={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                      <Heading4 $colorName={setMainColorForPaymentSchedule(item, index).header}>
                                        {`${formatMonthYear(item.start)} - ${formatMonthYear(item.end)}`}
                                      </Heading4>
                                      <ParagraphBody
                                        $colorName={setMainColorForPaymentSchedule(item, index).subHeader}
                                        translation-key="common_month"
                                        $fontWeight={400}
                                        className={classes.monthsContent}
                                      >
                                        (
                                        {item.solutionConfig.paymentMonthSchedule}{" "}
                                        {t("common_month", {
                                          s:
                                            item.solutionConfig.paymentMonthSchedule === 1
                                              ? ""
                                              : t("common_s"),
                                        })}
                                        )
                                      </ParagraphBody>
                                    </Box>
                                    <Heading4
                                      variant="tabular_nums"
                                      $colorName={setMainColorForPaymentSchedule(item, index).subHeader}
                                      $fontWeight={500}
                                      className={classes.priceWrapper}
                                    >
                                      <Dolar sx={{ color: `var(${setMainColorForPaymentSchedule(item, index).subHeader})`, width: '20px', height: '20px' }} />
                                      <span>{getCostCurrency(item.totalAmount)?.show}</span>
                                    </Heading4>
                                  </Grid>
                                  <Box className={classes.contentRightSwiper}>
                                    {item.status === PaymentScheduleStatus.NOT_PAID && (
                                      <Box className={classes.contentRightSwiperItem}>
                                        <Button
                                          className={clsx(!index ? classes.btnPaynow : classes.btnWating, classes.mainBtn)}
                                          btnType={BtnType.Raised}
                                          endIcon={<CreditCardIcon sx={{ fontSize: "15px !important", color: !index ? "var(--white)" : "var(--gray-60)" }} />}
                                          children={
                                            !index ? (
                                              <TextBtnSmall
                                                translation-key="brand_track_your_next_payment_title_button_pay_now"
                                              >
                                                {t(
                                                  "brand_track_your_next_payment_title_button_pay_now"
                                                )}
                                              </TextBtnSmall>
                                            ) : (
                                              <TextBtnSmall
                                                $colorName={"--gray-60"}
                                                translation-key="brand_track_your_next_payment_title_button_waiting"
                                              >
                                                {t(
                                                  "brand_track_your_next_payment_title_button_waiting"
                                                )}
                                              </TextBtnSmall>
                                            )
                                          }
                                          onClick={() => goToPayNow(item)}
                                          disabled={!!index}
                                          sx={{ boxShadow: "unset !important" }}
                                        />

                                        <ParagraphSmall
                                          pt={0.5}
                                          translation-key="brand_track_your_next_payment_sub_due"
                                          $colorName={"--gray-90"}
                                          className={classes.textBottomRight}
                                        >{`${t(
                                          "brand_track_your_next_payment_sub_due"
                                        )} ${formatFullDate(item.dueDate)}`}</ParagraphSmall>
                                      </Box>
                                    )}
                                    {item.status ===
                                      PaymentScheduleStatus.IN_PROGRESS && (
                                        <Box className={classes.contentRightSwiperItem}>
                                          <Button
                                            btnType={BtnType.Raised}
                                            startIcon={<HourglassBottomIcon sx={{ fontSize: "19px !important" }} />}
                                            children={
                                              <TextBtnSmall
                                                $colorName={"--warning-dark"}
                                                translation-key="brand_track_your_next_payment_title_button_processing"
                                              >
                                                {t(
                                                  "brand_track_your_next_payment_title_button_processing"
                                                )}
                                              </TextBtnSmall>
                                            }
                                            onClick={() => onOpenModal(item)}
                                            className={clsx(classes.processingBtn, classes.mainBtn)}
                                          />
                                          <ParagraphSmallUnderline2
                                            $colorName={"--gray-90"}
                                            className={classes.textBottomRight}
                                            pt={0.5}
                                            onClick={() => onOpenModal(item)}
                                            translation-key="brand_track_your_next_payment_sub_view_detail"
                                          >
                                            {t(
                                              "brand_track_your_next_payment_sub_view_detail"
                                            )}
                                          </ParagraphSmallUnderline2>
                                        </Box>
                                      )}
                                    {item.status === PaymentScheduleStatus.OVERDUE && (
                                      <Box className={classes.contentRightSwiperItem}>
                                        <Button
                                          className={classes.mainBtn}
                                          btnType={BtnType.Raised}
                                          endIcon={<CreditCardIcon sx={{ fontSize: "15px !important" }} />}
                                          disabled={true}
                                          children={
                                            <TextBtnSmall
                                              $colorName={"--gray-20"}
                                              translation-key="brand_track_your_next_payment_title_button_waiting"
                                            >
                                              {t(
                                                "brand_track_your_next_payment_title_button_waiting"
                                              )}
                                            </TextBtnSmall>
                                          }
                                          sx={{ boxShadow: "unset !important" }}
                                        />
                                        <ParagraphSmall
                                          pt={0.5}
                                          $colorName={"--gray-40"}
                                          translation-key="brand_track_your_next_payment_sub_due"
                                          className={classes.textBottomRight}
                                        >
                                          {`${t(
                                            "brand_track_your_next_payment_sub_due"
                                          )} ${formatFullDate(item.dueDate)}`}
                                        </ParagraphSmall>
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                      <Box
                        className={clsx(classes.iconSlide, classes.iconSlideRight)}
                      >
                        <KeyboardArrowRightIcon />
                      </Box>
                    </Grid>
                  </Box>
                </Grid>
              )}
              <PaymentHistoryList projectId={projectId} />
            </Grid>
          </Grid>
          <PopupConfirmCancelSubsription
            projectId={projectId}
            isOpen={onSubmitCancelSubsription}
            onCancel={onCloseSubmitCancelSubsription}
            onSubmit={(reson) => submitCancelSubsription(reson)}
          />
          {paymentScheduleForPay && isOpenPopupPaynow && (
            <PopupPayNow
              isOpen={isOpenPopupPaynow}
              onClose={onClose}
              paymentSchedule={paymentScheduleForPay}
              onOpenModal={onOpenModal}
            />
          )}
          {paymentScheduleForPay && isOpenPopupBankTransfer && (
            <PopupBankTransfer
              isOpen={isOpenPopupBankTransfer}
              onCancel={onClose}
              onDownloadInvoice={() => handleDownloadInvoice(paymentScheduleForPay)}
              onCancelPayment={onCancelPayment}
              paymentSchedule={paymentScheduleForPay}
            />
          )}
          {paymentScheduleForPay && isOpenPopupOnlinePayment && (
            <PopupOnlinePayment
              isOpen={isOpenPopupOnlinePayment}
              onCancel={onClose}
              onDownloadInvoice={() => handleDownloadInvoice(paymentScheduleForPay)}
              onCancelPayment={onCancelPayment}
              paymentSchedule={paymentScheduleForPay}
            />
          )}
          {paymentScheduleForPay && isOpenPopupSuportAgent && (
            <PopupSupportAgent
              isOpen={isOpenPopupSuportAgent}
              onCancel={onClose}
              onDownloadInvoice={() => handleDownloadInvoice(paymentScheduleForPay)}
              onCancelPayment={onCancelPayment}
              paymentSchedule={paymentScheduleForPay}
            />
          )}
          <Footer />
        </Content>
      </LeftContent>
    </PageRoot>
  );
};
export default YourNextPayment;
